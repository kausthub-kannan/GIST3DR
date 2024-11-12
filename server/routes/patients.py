from typing import List, Annotated

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.params import Query
from pydicom.filebase import DicomBytesIO
from sqlalchemy import select
from sqlmodel import Session
from database.schemas.tables import Patient
from utils.exporter import OBJExporter
from utils.dicom import read_dicom_slices
from database.utils.storage import check_file_exists
from database.utils.connect import DBConfig
from utils.model import masks_generator_pipeline
from utils.schema import PatientIndividual
from utils.setup import setup_logger

load_dotenv()


def get_session():
    with Session(engine) as session:
        yield session


db_config = DBConfig()
engine = db_config.connect_to_database()
supabase = db_config.connect_to_storage()
logger = setup_logger("patients", "logs/patients.log")

router = APIRouter(
    prefix="/patient", tags=["patient"], responses={404: {"description": "Not found"}}
)


async def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
):
    try:
        user = supabase.auth.get_user(credentials.credentials)
        return user
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


SessionDep = Annotated[Session, Depends(get_session)]
AuthDep = Annotated[dict, Depends(verify_token)]


@router.get("/")
async def get_patients(
    auth: AuthDep, session: SessionDep, limit: Annotated[int, Query(le=100)] = 10
) -> List[Patient]:
    """Get all patients with pagination"""
    db_patients = session.exec(select(Patient).limit(limit)).all()
    patients = [db_patient[0] for db_patient in db_patients]
    logger.info(f"Retrieved {len(patients)} patients")
    return patients


@router.get("/{patient_id}")
async def get_patient(
    patient_id: str, session: SessionDep, auth: AuthDep
) -> PatientIndividual:
    """Get a specific patient by ID"""
    patient = session.get(Patient, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    patient_data = PatientIndividual(
        id=str(patient.id),
        name=patient.name,
        age=patient.age,
        bone_density_gram_per_centimeter_sq=patient.bone_density_gram_per_centimeter_sq,
        height_millimeter=patient.height_millimeter,
        width_millimeter=patient.width_millimeter,
        thickness_millimeter=patient.thickness_millimeter,
        area_millimeter_sq=patient.area_millimeter_sq,
        cancellous_url=(
            supabase.storage.from_("bone_models").create_signed_url(
                f"{patient_id}/cancellous.obj", 12000
            )["signedURL"]
            if check_file_exists(
                supabase, "bone_models", f"{patient_id}/cancellous.obj"
            )
            else None
        ),
        cortical_url=(
            supabase.storage.from_("bone_models").create_signed_url(
                f"{patient_id}/cortical.obj", 12000
            )["signedURL"]
            if check_file_exists(supabase, "bone_models", f"{patient_id}/cortical.obj")
            else None
        ),
        nerve_canal_url=(
            supabase.storage.from_("bone_models").create_signed_url(
                f"{patient_id}/nerve_canal.obj", 12000
            )["signedURL"]
            if check_file_exists(
                supabase, "bone_models", f"{patient_id}/nerve_canal.obj"
            )
            else None
        ),
    )

    logger.info("Retrieved patient")

    return patient_data


@router.post("/create", response_model=Patient)
async def create_patient(
    auth: AuthDep,
    session: SessionDep,
    patient: Patient = Depends(),
    dicom_file: UploadFile = File,
) -> Patient:
    """Create a new patient"""

    dicom_bytes = await dicom_file.read()
    dicom_buffer = DicomBytesIO(dicom_bytes)
    slices = read_dicom_slices(dicom_buffer)
    logger.info(f"Read {len(slices)} slices from DICOM file")

    masks, measurements = masks_generator_pipeline(slices[:5])
    logger.info("Generated masks and measurements")

    patient.height_millimeter = measurements[2]["height"]
    patient.width_millimeter = measurements[2]["width"]
    session.add(patient)

    obj_exporter = OBJExporter()
    try:
        label_names = ["cancellous", "cortical", "nerve_canal"]
        for label, mask_list in masks.items():
            if mask_list:
                obj_content = obj_exporter.save_multiple_masks_to_obj(mask_list)
                obj_file = f"{patient.id}_{label_names[label]}.obj"
                supabase.storage.from_("bone_models").upload(
                    path=obj_file,
                    file=obj_content.encode(),
                    file_options={"contentType": "application/x-tgif"},
                )

        logger.info("Saved OBJ files to storage")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to save OBJ files: {e}",
        )

    session.commit()
    session.refresh(patient)
    logger.info("Created patient")

    return patient


@router.delete("/{patient_id}")
async def delete_patient(patient_id: str, session: SessionDep, auth: AuthDep):
    """Delete a patient by ID"""
    patient = session.get(Patient, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    session.delete(patient)
    supabase.storage.from_("bone_models").remove([f"{patient_id}"])
    session.commit()
    session.refresh(patient)
    logger.info("Deleted patient")
    return {"message": "Patient deleted successfully"}


@router.put("/{patient_id}")
async def update_patient(
    patient_id: str, updated_patient: Patient, session: SessionDep, auth: AuthDep
) -> Patient:
    """Update a patient by ID"""
    existing_patient = session.get(Patient, patient_id)
    if not existing_patient:
        raise HTTPException(
            status_code=404, detail=f"Patient with ID {patient_id} not found"
        )

    for key, value in updated_patient.dict(exclude_unset=True).items():
        setattr(existing_patient, key, value)

    session.add(existing_patient)
    session.commit()
    session.refresh(existing_patient)
    logger.info("Updated patient")
    return existing_patient
