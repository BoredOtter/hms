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

class PatientRequest(BaseModel):
    First_name: str
    Last_name: str
    Date_of_birth: date
    Gender: str
    Contact_number: str
    Address: str