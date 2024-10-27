from typing import List, Annotated, Type
import uvicorn
from fastapi import FastAPI, Depends
from fastapi.params import Query
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlmodel import Session
from dotenv import load_dotenv
from database.utils.connect import DBConfig
from database.schemas.tables import Patient

load_dotenv()

db_config = DBConfig()
engine = db_config.connect_to_database()


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
app = FastAPI()


@app.get("/", response_class=JSONResponse)
async def read_root():
    return {"message": "Hello World"}


@app.get("/patients")
async def get_patients(
    session: SessionDep, limit: Annotated[int, Query(le=100)] = 10
) -> List[Patient]:
    db_patients = session.exec(select(Patient).limit(limit)).all()
    patients = [db_patient[0] for db_patient in db_patients]
    return patients


@app.get("/patient/{patient_id}")
async def get_patient(patient_id: str, session: SessionDep) -> Type[Patient]:
    patient = session.get(Patient, patient_id)
    return patient


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
