from pydantic import BaseModel
from datetime import date, datetime, time
from typing import Optional


class CreateDepartment(BaseModel):
    Department_name: str
    Description: str
    Contact_info: str


class CreateRoom(BaseModel):
    ID_department: int
    Number_of_beds: int


class CreateBedReservation(BaseModel):
    ID_patient: str
    ID_room: int
    Start_date: date
    End_date: date


class UpdateBedReservationTime(BaseModel):
    Start_date: date
    End_date: date


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


class CreateOperatingRoom(BaseModel):
    ID_department: int
    Room_name: str


class CreateOperatingRoomReservations(BaseModel):
    Reservation_date: date
    Start_time: time  
    End_time: time  
