from typing import List, Annotated

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.params import Query
from sqlalchemy import select
from sqlmodel import Session
from database.schemas.tables import Patient
from utils.schema import PatientIndividual
from database.utils.storage import check_file_exists
from database.utils.connect import DBConfig

load_dotenv()


def get_session():
    with Session(engine) as session:
        yield session


db_config = DBConfig()
engine = db_config.connect_to_database()
supabase = db_config.connect_to_storage()

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
                f"{patient_id}_cancellous.obj", 12000
            )["signedURL"]
            if check_file_exists(
                supabase, "bone_models", f"{patient_id}_cancellous.obj"
            )
            else None
        ),
        cortical_url=(
            supabase.storage.from_("bone_models").create_signed_url(
                f"{patient_id}_cortical.obj", 12000
            )["signedURL"]
            if check_file_exists(supabase, "bone_models", f"{patient_id}_cortical.obj")
            else None
        ),
        nerve_canal_url=(
            supabase.storage.from_("bone_models").create_signed_url(
                f"{patient_id}_nerve_canal.obj", 12000
            )["signedURL"]
            if check_file_exists(
                supabase, "bone_models", f"{patient_id}_nerve_canal.obj"
            )
            else None
        ),
    )

    return patient_data


@router.post("/create")
async def create_patient(
    patient: Patient, session: SessionDep, auth: AuthDep
) -> Patient:
    """Create a new patient"""
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return patient


@router.delete("/{patient_id}")
async def delete_patient(patient_id: str, session: SessionDep, auth: AuthDep):
    """Delete a patient by ID"""
    patient = session.get(Patient, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    session.delete(patient)
    session.commit()
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

    # Update patient attributes
    for key, value in updated_patient.dict(exclude_unset=True).items():
        setattr(existing_patient, key, value)

    session.add(existing_patient)
    session.commit()
    session.refresh(existing_patient)
    return existing_patient
