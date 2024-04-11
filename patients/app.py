from fastapi import FastAPI, Depends, HTTPException
import logging
from os import environ
from utils import token_validator
from models import Patient as patient_model
from schemas import PatientRequest as patient_request_schema
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
    realm_name="hms",
    user_realm_name="hms",
    client_id="admin-cli",
    client_secret_key="i5KiCB5XeenPLte59BEKcZiYzbDM2GKh",
    verify=False,
)

keycloak_admin = KeycloakAdmin(connection=keycloak_connection)


@app.get("/protected")
@token_validator
async def protected_endpoint():
    return "This is the protected endpoint from patient-service."


@app.get("/getall/kc")
def get_patients_kc():
    return keycloak_admin.get_users({})
    
@app.get("/getall/db")
def get_patients_db(db=Depends(get_db)):
    return db.query(patient_model).all()

@app.post("/create")
def create_patient(patient: patient_request_schema, db=Depends(get_db)):
    # combination of name and phone number
    patient_username = (
        patient.First_name + "-" + patient.Last_name + "-" + patient.Contact_number
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
        raise HTTPException(status_code=500, detail="Error creating patient in database")
    
    # If patient creation in database is successful, return success message
    return {"message": "Patient created successfully."}


@app.get("/get/{patient_uuid}")
def get_patient(patient_uuid: str, db=Depends(get_db)):
    return db.query(patient_model).filter(patient_model.Patient_uuid == patient_uuid).first()
