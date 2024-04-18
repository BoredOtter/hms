from pydantic import BaseModel
from typing import Optional, List

class CreateMedication(BaseModel):
    Medication_name: str
    Active_substance: str
    Form: str
    Manufacturer: str
    Price: float
    
class CreatePrescriptionMedication(BaseModel):
    ID_medication: int
    Quantity: int
    Dosage: str
    
class CreatePrescriptionUserData(BaseModel):
    ID_patient: str
    ID_doctor: str
      
class UpdateMedication(BaseModel):
    Medication_name: Optional[str]
    Form: Optional[str]
    Dosage: Optional[str]
    Manufacturer: Optional[str]
    Price: Optional[float]
    Available_quantity: Optional[int]
    
class CreatePrescription(BaseModel):
    Prescription_data: CreatePrescriptionUserData
    Medication_list: List[CreatePrescriptionMedication]