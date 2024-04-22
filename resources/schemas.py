from pydantic import BaseModel
from datetime import date, time
from typing import Optional


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


class MoveRoom(BaseModel):
    ID_department: int


# ======================== Bed Reservation Management ========================
class CreateBedReservation(BaseModel):
    ID_patient: str
    ID_room: int
    Start_date: date
    End_date: date


class UpdateBedReservationTime(BaseModel):
    Start_date: date
    End_date: date


# ======================== Employee Management========================
class CreateEmployee(BaseModel):
    First_name: str
    Last_name: str
    Employment_date: date
    Position: str
    Department_id: int


class UpdateEmployee(BaseModel):
    Last_name: str
    Position: str
    Department_id: int


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
    Related_department: int


class UpdateMedicalProcedure(BaseModel):
    Procedure_name: str
    Description: str
    Costs: str
    Related_department: int


# ======================== Surgical Plan Management ========================
class CreateSurgicalPlan(BaseModel):
    ID_procedure: int
    Date: date
    Start_time: time
    End_time: time
    ID_patient: int


class UpdateSurgicalPlan(BaseModel):
    Date: date
    Start_time: time
    End_time: time


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
    ID_operating_room: int
    Reservation_date: date
    Start_time: time
    End_time: time


class UpdateOperatingRoomReservation(BaseModel):
    Reservation_date: date
    Start_time: time
    End_time: time
