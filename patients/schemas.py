from pydantic import BaseModel
from datetime import date

class Patient(BaseModel):
    ID_patient: int
    First_name: str
    Last_name: str
    Date_of_birth: date
    Gender: str
    Contact_number: str = None
    Address: str = None
