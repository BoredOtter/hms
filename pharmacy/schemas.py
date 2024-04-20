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
      
class UpdateMedication(CreateMedication):
    Medication_name: Optional[str] = None
    Active_substance: Optional[str] = None
    Form: Optional[str] = None
    Manufacturer: Optional[str] = None
    Price: Optional[float] = None
    
class CreatePrescription(BaseModel):
    Prescription_data: CreatePrescriptionUserData
    Medication_list: List[CreatePrescriptionMedication]
    
class UpdatePrescriptionMedicationList(BaseModel):
    Medication_list: List[CreatePrescriptionMedication]