from fastapi import FastAPI, Depends, HTTPException
import logging
from os import environ
from utils import token_validator

from models import Patient as patient_model
from models import MedicalHistory as medical_history_model
from models import VitalSigns as vital_signs_model

from schemas import PatientRequest as patient_request_schema
from schemas import PatientUpdate as patient_update_schema
from schemas import MedicalHistory as medical_history_schema
from schemas import VitalSigns as vital_signs_schema

from database import get_db
from keycloak import KeycloakAdmin, KeycloakOpenIDConnection
from keycloak.exceptions import KeycloakPostError

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
app = FastAPI()

KC_URL = environ.get("KC_URL", "http://keycloak")
KC_PORT = environ.get("KC_PORT", "8080")
KC_REALM = environ.get("KC_REALM", "hms")
KC_CLIENT_ID = environ.get("KC_CLIENT_ID", "python")
KC_CLIENT_SECRET = environ.get("KC_CLIENT_SECRET")

keycloak_connection = KeycloakOpenIDConnection(
    server_url=f"{KC_URL}:{KC_PORT}",
    username="admin",
    password="admin",
    realm_name=KC_REALM,
    user_realm_name=KC_REALM,
    client_id=KC_CLIENT_ID,
    client_secret_key=KC_CLIENT_SECRET,
    verify=False,
)

keycloak_admin = KeycloakAdmin(connection=keycloak_connection)

# ======================== Patient Management ========================

@app.get("/getall/kc", tags=["Patient"])
def get_patients_kc():
    return keycloak_admin.get_users({})
    
@app.get("/getall/db", tags=["Patient"])
def get_patients_db(db=Depends(get_db)):
    return db.query(patient_model).all()

@app.post("/create", tags=["Patient"])
def create_patient(patient: patient_request_schema, db=Depends(get_db)):
    # combination of name and phone number
    patient_username = (
        patient.First_name + "-" + patient.Last_name + "-" + patient.PESEL
    )

    # create patient in keycloak (will fail if patient already exists in keycloak)
    try:
        keycloak_admin.create_user(
            {
                "username": patient_username,
                "enabled": True,
            },
            exist_ok=False,
        )
    except KeycloakPostError as e:
        logger.error("Error creating patient in keycloak: %s", e)
        raise HTTPException(status_code=409, detail="Error creating patient in keycloak")
    
    # If patient creation in keycloak is successful, create patient in database
    try:
        user_id = keycloak_admin.get_user_id(patient_username)
        logger.info("User ID: %s", user_id)
        patient = patient_model(**patient.model_dump(), Patient_uuid=user_id)
        db.add(patient)
        db.commit()
    except Exception as e:
        logger.error("Error creating patient in database: %s", e)
        keycloak_admin.delete_user(user_id)
        raise HTTPException(status_code=500, detail="Error creating patient in database")
    
    # If patient creation in database is successful, return success message
    return {"message": "Patient created successfully."}


@app.get("/get/{patient_uuid}", tags=["Patient"])
def get_patient(patient_uuid: str, db=Depends(get_db)):
    return db.query(patient_model).filter(patient_model.Patient_uuid == patient_uuid).first()

@app.get("/getbypesel/{pesel}", tags=["Patient"])
def get_patient_by_pesel(pesel: str, db=Depends(get_db)):
    return db.query(patient_model).filter(patient_model.PESEL == pesel).first()

@app.get("/getbyname/{first_name}/{last_name}", tags=["Patient"])
def get_patient_by_name(first_name: str, last_name: str, db=Depends(get_db)):
    patient = db.query(patient_model).filter(patient_model.First_name == first_name, patient_model.Last_name == last_name).all()
    if patient:
        return patient
    raise HTTPException(status_code=404, detail="Patient not found")


@app.patch("/update/{patient_uuid}", tags=["Patient"])
def update_patient(patient_uuid: str, patient: patient_update_schema, db=Depends(get_db)):
    logger.info("Updating patient with UUID: %s and values: %s", patient_uuid, patient.model_dump())
    db.query(patient_model).filter(patient_model.Patient_uuid == patient_uuid).update(patient.model_dump())
    db.commit()
    return {"message": "Patient updated successfully."}

# ======================== Vital Signs Management ========================

@app.get("/get_vitals/{patient_uuid}", tags=["Vital Signs"])
def get_vitals(patient_uuid: str, db=Depends(get_db), all: bool = False):
    if all:
        return db.query(vital_signs_model).filter(vital_signs_model.Patient_uuid == patient_uuid).all()
    return db.query(vital_signs_model).filter(vital_signs_model.Patient_uuid == patient_uuid).first()

@app.post("/add_vitals/{patient_uuid}", tags=["Vital Signs"])
def add_vitals(patient_uuid: str, vital_signs: vital_signs_schema, db=Depends(get_db)):
    logger.info("Adding vital signs for patient with UUID: %s and values: %s", patient_uuid, vital_signs.model_dump())
    vital_signs = vital_signs_model(**vital_signs.model_dump(), Patient_uuid=patient_uuid)
    db.add(vital_signs)
    db.commit()
    return {"message": "Vital signs added successfully."}

# ======================== Medical History Management ========================

@app.get("/get_medical_history/{patient_uuid}", tags=["Medical History"])
def get_medical_history(patient_uuid: str, db=Depends(get_db), all: bool = False):
    if all:
        return db.query(medical_history_model).filter(medical_history_model.Patient_uuid == patient_uuid).all()
    return db.query(medical_history_model).filter(medical_history_model.Patient_uuid == patient_uuid).first()

@app.post("/add_medical_history/{patient_uuid}", tags=["Medical History"])
def add_medical_history(patient_uuid: str, medical_history: medical_history_schema, db=Depends(get_db)):
    logger.info("Adding medical history for patient with UUID: %s and values: %s", patient_uuid, medical_history.model_dump())
    medical_history = medical_history_model(**medical_history.model_dump(), Patient_uuid=patient_uuid)
    db.add(medical_history)
    db.commit()
    return {"message": "Medical history added successfully."}
