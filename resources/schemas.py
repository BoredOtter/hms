from datetime import date, time
from re import M
from typing import List, Optional
from webbrowser import Opera

from pydantic import BaseModel


# ======================== Department Management ========================
class CreateDepartment(BaseModel):
    Department_name: str
    Description: str
    Contact_info: str


# ======================== Room Management ========================
class CreateRoom(BaseModel):
    ID_department: int
    Number_of_beds: int


class UpdateBedInRoom(BaseModel):
    Number_of_beds: int


# ======================== Bed Reservation Management ========================
class CreateBedReservation(BaseModel):
    ID_patient: str
    ID_room: int
    Start_date: date
    End_date: date


class UpdateBedReservationTime(BaseModel):
    Start_date: date
    End_date: date


# ======================== Employee  Management ========================
class CreateEmployee(BaseModel):
    PESEL: str
    First_name: str
    Last_name: str
    Employment_date: date
    Position: str
    Department_id: int


# ======================== Employee Schedule Management ========================
class CreateEmployeeSchedule(BaseModel):
    Employee_uuid: str
    Date: date
    Start_time: time
    End_time: time


class UpdateEmployeeSchedule(BaseModel):
    Date: date
    Start_time: time
    End_time: time


# ======================== Medical Procedure Management ========================
class CreateMedicalProcedure(BaseModel):
    Procedure_name: str
    Description: str
    Costs: str
    Medical_personnel_list: List[str]


class UpdateMedicalProcedure(BaseModel):
    Procedure_name: Optional[str] = None
    Description: Optional[str] = None
    Costs: Optional[str] = None
    Medical_personnel_list: Optional[List[str]] = None


# ======================== Material Resource Management ========================
class CreateMaterialResource(BaseModel):
    Resource_name: str
    Description: str
    Available_quantity: int
    Department_id: int


class UpdateMaterialResource(BaseModel):
    Resource_name: str
    Description: str
    Available_quantity: int
    Department_id: int


# ======================== Operating Room Management ========================
class CreateOperatingRoom(BaseModel):
    ID_department: int
    Room_name: str


# ======================== Operating Room Reservations Management ========================
class CreateOperatingRoomReservation(BaseModel):
    ID_procedure: int
    ID_operating_room: int
    Reservation_date: date
    Start_time: time
    End_time: time


class UpdateOperatingRoomReservation(BaseModel):
    ID_operating_room: int
    Reservation_date: date
    Start_time: time
    End_time: time
