from typing import List, Optional

from pydantic import BaseModel

# ================== Medication Management ==================


class CreateMedication(BaseModel):
    Medication_name: str
    Active_substance: str
    Form: str
    Manufacturer: str
    Price: float


class UpdateMedication(CreateMedication):
    Medication_name: Optional[str] = None
    Active_substance: Optional[str] = None
    Form: Optional[str] = None
    Manufacturer: Optional[str] = None
    Price: Optional[float] = None


# ================== Prescription Medication Management ==================


class CreatePrescriptionMedication(BaseModel):
    ID_medication: int
    Quantity: int
    Dosage: str


class UpdatePrescriptionMedicationList(BaseModel):
    Medication_list: List[CreatePrescriptionMedication]


# ================== Prescription Management ==================


class CreatePrescriptionUserData(BaseModel):
    ID_patient: str
    ID_doctor: str


class CreatePrescription(BaseModel):
    Prescription_data: CreatePrescriptionUserData
    Medication_list: List[CreatePrescriptionMedication]
