from fastapi import FastAPI, Depends
import logging
from utils import token_validator
from models import Patient as patient_model
from schemas import Patient as patient_schema
from database import get_db

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
app = FastAPI()

@app.get("/protected")
@token_validator
async def protected_endpoint():
    return "This is the protected endpoint from patient-service."

@app.get("/getall")
def get_patients(db=Depends(get_db)):
    return db.query(patient_model).all()


@app.post("/create")
def create_patient(patient: patient_schema, db = Depends(get_db)):
    db.add(patient_model(**patient.dict()))
    db.commit()
    return {"message": "Patient created successfully."}

