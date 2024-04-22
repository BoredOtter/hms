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


# ======================== Employee Schedule Management ========================
class CreateEmployeeSchedule(BaseModel):
    ID_employee: int
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


class UpdateMedicalProcedure(BaseModel):
    Procedure_name: str
    Description: str
    Costs: str


# ======================== Surgical Plan Management ========================
class CreateSurgicalPlan(BaseModel):
    ID_procedure: int
    Medical_personnel_list: List[str]


class UpdateSurgicalPlan(BaseModel):
    Medical_personnel_list: List[str]


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
    ID_plan: int
    ID_operating_room: int
    Reservation_date: date
    Start_time: time
    End_time: time


class UpdateOperatingRoomReservation(BaseModel):
    ID_operating_room: int
    Reservation_date: date
    Start_time: time
    End_time: time
