from pydantic import BaseModel
from datetime import date
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
    ID_room: int
    ID_department: int
    Room_name: str
    capacity: int


class CreateOperatingRoomReservations(BaseModel):
    ID_reservation: int
    ID_room: int
    Reservation_date: date
    Start_time: str  # TODO it's a time, but we need to figure out how to handle it
    End_time: str  # TODO it's a time, but we need to figure out how to handle it
    Purpose: str