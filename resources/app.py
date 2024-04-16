from fastapi import FastAPI, Depends, HTTPException
import logging
from utils import token_validator
from os import environ
from keycloak import KeycloakAdmin, KeycloakOpenIDConnection

from models import Department as department_model
from models import Room as room_model
from models import BedReservation as bed_reservation_model
from models import MaterialResource as material_resource_model
from models import OperatingRoom as operating_room_model
from models import OperatingRoomReservations as operating_room_reservations_model

from schemas import CreateDepartment as create_department_schema
from schemas import CreateRoom as create_room_schema
from schemas import CreateBedReservation as create_bed_reservation_schema
from schemas import UpdateBedReservationTime as update_bed_reservation_time_schema
from schemas import UpdateMaterialResource as update_material_resource_schema
from schemas import CreateMaterialResource as create_material_resource_schema
from schemas import CreateOperatingRoom as create_operating_room_schema
from schemas import CreateOperatingRoomReservations as create_operating_room_reservations_schema

from database import get_db


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
app = FastAPI()

KC_URL = environ.get("KC_URL", "http://keycloak")
KC_PORT = environ.get("KC_PORT", "8080")
KC_REALM = environ.get("KC_REALM", "hms")
KC_CLIENT_ID = environ.get("KC_CLIENT_ID", "python")
KC_CLIENT_SECRET = environ.get("KC_CLIENT_SECRET")

keycloak_connection = KeycloakOpenIDConnection(
    server_url=f"{KC_URL}:{KC_PORT}",
    username="admin",
    password="admin",
    realm_name=KC_REALM,
    user_realm_name=KC_REALM,
    client_id=KC_CLIENT_ID,
    client_secret_key=KC_CLIENT_SECRET,
    verify=False,
)

keycloak_admin = KeycloakAdmin(connection=keycloak_connection)


# ======================== Department Management ========================
@app.get("/get/department/all", tags=["Department"])
def get_departments(db=Depends(get_db)):
    department = db.query(department_model).all()
    if department is None:
        return HTTPException(status_code=404, detail="Departments not found")
    return department


@app.get("/get/department/id/{department_id}", tags=["Department"])
def get_department_by_id(department_id: int, db=Depends(get_db)):
    department = db.query(department_model).filter(department_model.ID_department == department_id).first()
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    
    # Retrieve rooms for the department
    rooms = db.query(room_model).filter(room_model.ID_department == department_id).all()
    
    # Retrieve bed reservations for each room
    for room in rooms:
        room.bed_reservations = db.query(bed_reservation_model).filter(bed_reservation_model.ID_room == room.ID_room).all()
    
    department.rooms = rooms
    return department


@app.get("/get/department/name/{name}", tags=["Department"])
def get_department_by_name(department_name: str, db=Depends(get_db)):
    department = db.query(department_model).filter(department_model.Department_name == department_name).first()
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    
    # Retrieve rooms for the department
    rooms = db.query(room_model).filter(room_model.ID_department == department.ID_department).all()
    
    # Retrieve bed reservations for each room
    for room in rooms:
        room.bed_reservations = db.query(bed_reservation_model).filter(bed_reservation_model.ID_room == room.ID_room).all()
    
    department.rooms = rooms
    return department


@app.post("/create/department", tags=["Department"])
def create_department(department: create_department_schema, db=Depends(get_db)):
    department = department_model(**department.model_dump())
    try: 
        db.add(department)
        db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Error while adding department.")

    return {"message": "Department added successfully."}


@app.get("/get/department/material_resources/{department_id}", tags=["Department"])
def get_department_material_resources(department_id: int, db=Depends(get_db)):
    department = db.query(department_model).filter(department_model.ID_department == department_id).first()
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    # Retrieve material resources for the department
    material_resources = db.query(material_resource_model).filter(material_resource_model.Department_id == department_id).all()
    department.material_resources = material_resources
    return department


@app.delete("/delete/department/{department_id}", tags=["Department"])
def delete_department(department_id: int, db=Depends(get_db)):
    department = db.query(department_model).filter(department_model.ID_department == department_id).first()
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    try:
        db.delete(department)
        db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Error while deleting department.")
    return {"message": "Department deleted successfully."}


# ======================== Room Management ========================
@app.post("/create/room", tags=["Room"])
def create_room(room: create_room_schema, db=Depends(get_db)):
    room = room_model(**room.model_dump())
    try:
        db.add(room)
        db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Error while creating room.")
    return {"message": "Room added successfully."}


@app.get("/get/room/id/{room_id}", tags=["Room"])
def get_room_by_id(room_id: int, db=Depends(get_db)):
    room = db.query(room_model).filter(room_model.ID_room == room_id).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Retrieve bed reservations for the room
    room.bed_reservations = db.query(bed_reservation_model).filter(bed_reservation_model.ID_room == room.ID_room).all()
    return room


# ======================== Bed Reservation Management ========================
@app.post("/create/bed_reservation", tags=["Bed Reservation"])
def create_bed_reservation(bed_reservation: create_bed_reservation_schema, db=Depends(get_db)):
    bed_reservation = bed_reservation_model(**bed_reservation.model_dump())
    
    # check patient id in keycloak
    patient_id = bed_reservation.ID_patient
    user = keycloak_admin.get_user(patient_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # check if dates are valid
    if bed_reservation.Start_date > bed_reservation.End_date:
        raise HTTPException(status_code=400, detail="Start date cannot be after end date")
    
    # check if patient already has a bed reservation this period
    existing_bed_reservation = db.query(bed_reservation_model).filter(bed_reservation_model.ID_patient == patient_id).first()
    if existing_bed_reservation is not None:
        if existing_bed_reservation.Start_date <= bed_reservation.Start_date <= existing_bed_reservation.End_date:
            raise HTTPException(status_code=400, detail="Patient already has a bed reservation for this period")
    
    # check if room has available beds this period
    room = db.query(room_model).filter(room_model.ID_room == bed_reservation.ID_room).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    
    bed_reservations = db.query(bed_reservation_model).filter(bed_reservation_model.ID_room == room.ID_room).all()
    if len(bed_reservations) >= room.Number_of_beds:
        raise HTTPException(status_code=400, detail="Room is full")
    try:
        # create bed reservation
        db.add(bed_reservation)
        db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Error while creating bed reservation.")
    return {"message": "Bed reservation added successfully."}

@app.get("/get/bed_reservation/{patient_id}", tags=["Bed Reservation"])
def get_bed_reservation(patient_id: str, db=Depends(get_db)):
    bed_reservation = db.query(bed_reservation_model).filter(bed_reservation_model.ID_patient == patient_id).first()
    if bed_reservation is None:
        raise HTTPException(status_code=404, detail="Bed reservation not found")
    return bed_reservation


@app.patch("/update/bed_reservation/{patient_id}", tags=["Bed Reservation"])
def update_bed_reservation_time(patient_id: str, bed_reservation: update_bed_reservation_time_schema, db=Depends(get_db)):
    existing_bed_reservation = db.query(bed_reservation_model).filter(bed_reservation_model.ID_patient == patient_id).first()
    if existing_bed_reservation is None:
        raise HTTPException(status_code=404, detail="Bed reservation not found")
    
    # check if dates are valid
    if bed_reservation.Start_date > bed_reservation.End_date:
        raise HTTPException(status_code=400, detail="Start date cannot be after end date")
    try:
        db.query(bed_reservation_model).filter(bed_reservation_model.ID_patient == patient_id).update(bed_reservation.model_dump())
        db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Error while updating bed reservation.")
    return {"message": "Bed reservation updated successfully."}


@app.delete("/delete/bed_reservation/{patient_id}", tags=["Bed Reservation"])
def delete_bed_reservation(patient_id: str, db=Depends(get_db)):
    bed_reservation = db.query(bed_reservation_model).filter(bed_reservation_model.ID_patient == patient_id).first()
    if bed_reservation is None:
        raise HTTPException(status_code=404, detail="Bed reservation not found")
    try:
        db.delete(bed_reservation)
        db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Error while deleting bed reservation.")
    return {"message": "Bed reservation deleted successfully."}


# ======================== Material Resource Management ========================
@app.get("/get/material_resource/all/{department_id}", tags=["Material Resource"])
def get_material_resources(department_id: int, db=Depends(get_db)):
    material_resources = db.query(material_resource_model).filter(material_resource_model.Department_id == department_id).all()
    if material_resources is None:
        raise HTTPException(status_code=404, detail="Material resources not found")
    return material_resources


@app.get("/get/material_resource/id/{resource_id}", tags=["Material Resource"])
def get_material_resource(resource_id: int, db=Depends(get_db)):
    material_resource = db.query(material_resource_model).filter(material_resource_model.ID_resource == resource_id).first()
    if material_resource is None:
        raise HTTPException(status_code=404, detail="Material resource not found")
    return material_resource


@app.get("/get/material_resource/name/{name}", tags=["Material Resource"])
def get_material_resource_by_name(resource_name: str, db=Depends(get_db)):
    material_resource = db.query(material_resource_model).filter(material_resource_model.Resource_name == resource_name).first()
    if material_resource is None:
        raise HTTPException(status_code=404, detail="Material resource not found")
    return material_resource


@app.post("/create/material_resource", tags=["Material Resource"])
def create_material_resource(material_resource: create_material_resource_schema, db=Depends(get_db)):
    material_resource = material_resource_model(**material_resource.model_dump())
    
    # check if department exists
    department = db.query(department_model).filter(department_model.ID_department == material_resource.Department_id).first()
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    
    # check if available quantity is valid
    if material_resource.Available_quantity < 0:
        raise HTTPException(status_code=400, detail="Available quantity cannot be negative")
    
    try:
        db.add(material_resource)
        db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Error while adding material resource.")
    return {"message": "Material resource added successfully."}


@app.patch("/update/material_resource/{resource_id}", tags=["Material Resource"])
def update_material_resource(resource_id: int, material_resource: update_material_resource_schema, db=Depends(get_db)):
    existing_material_resource = db.query(material_resource_model).filter(material_resource_model.ID_resource == resource_id).first()
    if existing_material_resource is None:
        raise HTTPException(status_code=404, detail="Material resource not found")
    
    # check if available quantity is valid
    if material_resource.Available_quantity < 0:
        raise HTTPException(status_code=400, detail="Available quantity cannot be negative")
    
    # check if department exists
    department = db.query(department_model).filter(department_model.ID_department == material_resource.Department_id).first()
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    
    try:
        db.query(material_resource_model).filter(material_resource_model.ID_resource == resource_id).update(material_resource.model_dump())
        db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Error while updating material resource.")
    return {"message": "Material resource updated successfully."}


# ======================== Operating Room Management ========================
@app.post("/create/operating_room", tags=["Operating Room"])
def create_operating_room(operating_room: create_operating_room_schema, db=Depends(get_db)):
    # check if department exists
    department = db.query(department_model).filter(department_model.ID_department == operating_room.ID_department).first()
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    
    operating_room = operating_room_model(**operating_room.model_dump())
    
    try:
        db.add(operating_room)
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return {"message": "Operating room added successfully."}
