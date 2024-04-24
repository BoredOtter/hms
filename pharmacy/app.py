import logging
from os import environ

from database import get_db
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Medication, Prescription, PrescriptionMedication
from schemas import CreateMedication as create_medication_schema
from schemas import CreatePrescription as create_prescription_schema
from schemas import UpdateMedication as update_medication_schema
from schemas import (
    UpdatePrescriptionMedicationList as update_prescription_medication_list_schema,
)
from utils import token_validator

from keycloak import KeycloakAdmin, KeycloakOpenIDConnection

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
app = FastAPI(dependencies=[Depends(token_validator)])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

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


# ================== Medication ==================


@app.get("/get/medicationName/{medication_name}", tags=["Medication"])
def get_medication(medication_name: str, db=Depends(get_db)):
    medication = (
        db.query(Medication)
        .filter(Medication.Medication_name == medication_name)
        .first()
    )
    if medication:
        return medication
    else:
        raise HTTPException(status_code=404, detail="Medication not found")


@app.get("/get/medications", tags=["Medication"])
def get_medications(db=Depends(get_db)):
    medications = db.query(Medication).all()
    return medications


@app.get("/get/medicationID/{medication_id}", tags=["Medication"])
def get_medication(medication_id: int, db=Depends(get_db)):
    medication = (
        db.query(Medication).filter(Medication.ID_medication == medication_id).first()
    )
    if medication:
        return medication
    else:
        raise HTTPException(status_code=404, detail="Medication not found")


@app.post("/add/medication", tags=["Medication"])
def add_medication(medication: create_medication_schema, db=Depends(get_db)):
    existing_medication = (
        db.query(Medication)
        .filter(Medication.Medication_name == medication.Medication_name)
        .first()
    )
    if existing_medication:
        raise HTTPException(
            status_code=400, detail="Medication with this name already exists"
        )

    medication = Medication(**medication.model_dump())
    try:
        db.add(medication)
        db.commit()
    except:
        raise HTTPException(status_code=400, detail="Error while adding medication")
    return {"message": "Medication added successfully"}


@app.patch("/update/medication/{medication_id}", tags=["Medication"])
def update_medication(
    medication_id: int, medication: update_medication_schema, db=Depends(get_db)
):
    updated_fields = {}
    if medication.Medication_name:
        updated_fields["Medication_name"] = medication.Medication_name
    if medication.Form:
        updated_fields["Form"] = medication.Fosage
    if medication.Active_substance:
        updated_fields["Active_substance"] = medication.Active_substance
    if medication.Manufacturer:
        updated_fields["Manufacturer"] = medication.Manufacturer
    if medication.Price:
        updated_fields["Price"] = medication.Price

    if updated_fields:
        try:
            db.query(Medication).filter(
                Medication.ID_medication == medication_id
            ).update(updated_fields)
            db.commit()
        except:
            raise HTTPException(
                status_code=400, detail="Error while updating medication"
            )
    else:
        raise HTTPException(status_code=400, detail="No fields to update")
    return {"message": "Medication updated successfully"}


# ================== Prescription ==================
@app.get("/get/prescription/{prescription_id}", tags=["Prescription"])
def get_prescription(prescription_id: int, db=Depends(get_db)):
    prescription = (
        db.query(Prescription)
        .filter(Prescription.ID_prescription == prescription_id)
        .first()
    )
    if prescription:
        return prescription
    else:
        raise HTTPException(status_code=404, detail="Prescription not found")


@app.get("/get/prescriptions", tags=["Prescription"])
def get_prescriptions(db=Depends(get_db)):
    prescriptions = db.query(Prescription).all()
    return prescriptions


@app.post("/add/prescription", tags=["Prescription"])
def add_prescription(prescription: create_prescription_schema, db=Depends(get_db)):
    prescription = prescription.model_dump()

    medication_list = prescription.get("Medication_list")
    prescription_data = prescription.get("Prescription_data")

    # check if patient exists
    patient = keycloak_admin.get_user(prescription_data.get("ID_patient"))
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # check if doctor exists
    doctor = keycloak_admin.get_user(prescription_data.get("ID_doctor"))
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # get the prescription data
    prescription = Prescription(**prescription_data)

    try:
        db.add(prescription)
        db.commit()
    except:
        raise HTTPException(status_code=400, detail="Error while adding prescription")

    # get last inserted prescription
    inserted_prescription = (
        db.query(Prescription).order_by(Prescription.ID_prescription.desc()).first()
    )

    # get list from prescription schema and add to PrescriptionMedication
    for medication in medication_list:
        medication["ID_prescription"] = inserted_prescription.ID_prescription
        prescription_medication = PrescriptionMedication(**medication)
        try:
            db.add(prescription_medication)
            db.commit()
        except:
            raise HTTPException(
                status_code=400, detail="Error while adding prescription medication"
            )

    return {"message": "Prescription added successfully"}


@app.get("/get/prescriptions/{patient_id}", tags=["Prescription"])
def get_prescriptions(patient_id: str, db=Depends(get_db)):
    prescriptions = db.query(Prescription).filter(Prescription.ID_patient == patient_id)
    return prescriptions


@app.get("/get/prescriptions/{patient_id}/{prescription_id}", tags=["Prescription"])
def get_prescription(patient_id: str, prescription_id: int, db=Depends(get_db)):
    # get the prescription for the patient
    prescription = (
        db.query(Prescription)
        .filter(Prescription.ID_patient == patient_id)
        .filter(Prescription.ID_prescription == prescription_id)
        .first()
    )

    # get the medications for the prescription
    prescription_medications = (
        db.query(PrescriptionMedication)
        .filter(PrescriptionMedication.ID_prescription == prescription_id)
        .all()
    )

    # get medication details
    medications = []
    for prescription_medication in prescription_medications:
        medication = (
            db.query(Medication)
            .filter(Medication.ID_medication == prescription_medication.ID_medication)
            .first()
        )
        medications.append(medication)

        prescription_medication.medication = medication
    prescription.prescription_medications = prescription_medications

    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")

    return prescription


# ================== Prescription Medication ==================
@app.delete(
    "/delete/prescription/{prescription_id}/{medication_id}", tags=["Prescription"]
)
def delete_prescription_medication(
    prescription_id: int, medication_id: int, db=Depends(get_db)
):
    try:
        db.query(PrescriptionMedication).filter(
            PrescriptionMedication.ID_prescription == prescription_id
        ).filter(PrescriptionMedication.ID_medication == medication_id).delete()
        db.commit()
    except:
        raise HTTPException(
            status_code=400, detail="Error deleting prescription medication"
        )
    return {"message": "Prescription medication deleted successfully"}


@app.patch("/update/prescription/{prescription_id}", tags=["Prescription"])
def update_prescription_medication_list(
    prescription_id: int,
    medication_list: update_prescription_medication_list_schema,
    db=Depends(get_db),
):
    updated_fields = {}
    for medication in medication_list.Medication_list:
        updated_fields["Quantity"] = medication.Quantity
        updated_fields["Dosage"] = medication.Dosage
        try:
            db.query(PrescriptionMedication).filter(
                PrescriptionMedication.ID_prescription == prescription_id
            ).filter(
                PrescriptionMedication.ID_medication == medication.ID_medication
            ).update(
                updated_fields
            )
            db.commit()
        except:
            raise HTTPException(
                status_code=400, detail="Error updating prescription medication"
            )
    return {"message": "Prescription medication updated successfully"}
