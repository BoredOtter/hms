from pydantic import BaseModel
from datetime import date

class Patient(BaseModel):
    Patient_uuid: str
    First_name: str
    Last_name: str
    Date_of_birth: date
    Gender: str
    Contact_number: str
    Address: str
    PESEL: str

class PatientRequest(BaseModel):
    First_name: str
    Last_name: str
    Date_of_birth: date
    Gender: str
    Contact_number: str
    Address: str
    PESEL: str
    
class PatientUpdate(BaseModel):
    Contact_number: str
    Address: str
    
class MedicalHistory(BaseModel):
    Entry_date: date
    Diagnosis: str
    Description_of_disease_or_health_problem: str
    Prescribed_medicines: str
    Doctor_notes: str

class VitalSigns(BaseModel):
    Date_and_time_of_measurement: date
    Blood_pressure: str
    Pulse: str
    Body_temperature: str
    Blood_sugar_level: str
    Other_medical_parameters: str