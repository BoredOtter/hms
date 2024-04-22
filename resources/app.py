from sqlalchemy import and_, or_
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
from models import OperatingRoomReservation as operating_room_reservation_model
from models import MedicalProcedure as medical_procedure_model
from models import Employee as employee_model
from models import EmployeeSchedule as employee_schedule_model
from models import SurgicalPlan as surgical_plan_model

from schemas import CreateDepartment as create_department_schema
from schemas import CreateRoom as create_room_schema
from schemas import UpdateBedInRoom as update_bed_number_room_schema
from schemas import CreateBedReservation as create_bed_reservation_schema
from schemas import UpdateBedReservationTime as update_bed_reservation_time_schema
from schemas import UpdateMaterialResource as update_material_resource_schema
from schemas import CreateMaterialResource as create_material_resource_schema
from schemas import CreateOperatingRoom as create_operating_room_schema
from schemas import (
    CreateOperatingRoomReservation as create_operating_room_reservation_schema,
)
from schemas import (
    UpdateOperatingRoomReservation as update_operating_room_reservation_schema,
)
from schemas import CreateMedicalProcedure as create_medical_procedure_schema
from schemas import UpdateMedicalProcedure as update_medical_procedure_schema
from schemas import CreateEmployeeSchedule as create_employee_schedule_schema
from schemas import UpdateEmployeeSchedule as update_employee_schedule_schema
from schemas import CreateSurgicalPlan as create_surgical_plan_schema
from schemas import UpdateSurgicalPlan as update_surgical_plan_schema


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
    if not department:
        raise HTTPException(status_code=404, detail="Departments not found")
    return department


@app.get("/get/department/id/{department_id}", tags=["Department"])
def get_department_by_id(department_id: int, db=Depends(get_db)):
    department = (
        db.query(department_model)
        .filter(department_model.ID_department == department_id)
        .first()
    )
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")

    # Retrieve rooms for the department
    rooms = db.query(room_model).filter(room_model.ID_department == department_id).all()

    # Retrieve bed reservations for each room
    for room in rooms:
        room.bed_reservations = (
            db.query(bed_reservation_model)
            .filter(bed_reservation_model.ID_room == room.ID_room)
            .all()
        )

    department.rooms = rooms
    return department


@app.get("/get/department/name/{name}", tags=["Department"])
def get_department_by_name(department_name: str, db=Depends(get_db)):
    department = (
        db.query(department_model)
        .filter(department_model.Department_name == department_name)
        .first()
    )
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")

    # Retrieve rooms for the department
    rooms = (
        db.query(room_model)
        .filter(room_model.ID_department == department.ID_department)
        .all()
    )

    # Retrieve bed reservations for each room
    for room in rooms:
        room.bed_reservations = (
            db.query(bed_reservation_model)
            .filter(bed_reservation_model.ID_room == room.ID_room)
            .all()
        )

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
    department = (
        db.query(department_model)
        .filter(department_model.ID_department == department_id)
        .first()
    )
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")

    # Retrieve material resources for the department
    material_resources = (
        db.query(material_resource_model)
        .filter(material_resource_model.Department_id == department_id)
        .all()
    )
    if not material_resources:
        raise HTTPException(status_code=404, detail="Material resources not found")
    return material_resources


@app.delete("/delete/department/{department_id}", tags=["Department"])
def delete_department(department_id: int, db=Depends(get_db)):
    department = (
        db.query(department_model)
        .filter(department_model.ID_department == department_id)
        .first()
    )
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    try:
        db.delete(department)
        db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Error while deleting department.")
    return {"message": "Department deleted successfully."}


# ======================== Room Management ========================
@app.get("/get/room/all", tags=["Room"])
def get_rooms(db=Depends(get_db)):
    rooms = db.query(room_model).all()
    if not rooms:
        raise HTTPException(status_code=404, detail="Rooms not found")
    return rooms


@app.get("/get/room/id/{room_id}", tags=["Room"])
def get_room_by_id(room_id: int, db=Depends(get_db)):
    room = db.query(room_model).filter(room_model.ID_room == room_id).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    return room


@app.get("/get/room/department/{department_id}", tags=["Room"])
def get_room_by_department(department_id: int, db=Depends(get_db)):
    rooms = db.query(room_model).filter(room_model.ID_department == department_id).all()
    if not rooms:
        raise HTTPException(status_code=404, detail="Rooms not found")
    return rooms


@app.post("/create/room", tags=["Room"])
def create_room(room: create_room_schema, db=Depends(get_db)):
    room = room_model(**room.model_dump())
    try:
        db.add(room)
        db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Error while creating room.")
    return {"message": "Room added successfully."}


@app.patch("/update/bed_in_room/{room_id}", tags=["Room"])
def update_bed_number_in_room(
    room_id: int, room: update_bed_number_room_schema, db=Depends(get_db)
):
    existing_room = db.query(room_model).filter(room_model.ID_room == room_id).first()
    if existing_room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    # check if number of exisging reservations is less than the new number of beds
    bed_reservations = (
        db.query(bed_reservation_model)
        .filter(bed_reservation_model.ID_room == room_id)
        .all()
    )
    if len(bed_reservations) > room.Number_of_beds:
        raise HTTPException(
            status_code=400,
            detail="Number of beds cannot be less than the number of existing bed reservations",
        )

    try:
        db.query(room_model).filter(room_model.ID_room == room_id).update(
            room.model_dump()
        )
        db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Error while updating room.")
    return {"message": "Room updated successfully."}


@app.delete("/delete/room/{room_id}", tags=["Room"])
def delete_room(room_id: int, db=Depends(get_db)):
    room = db.query(room_model).filter(room_model.ID_room == room_id).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    try:
        db.delete(room)
        db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Error while deleting room.")
    return {"message": "Room deleted successfully."}


# ======================== Bed Reservation Management ========================
@app.post("/create/bed_reservation", tags=["Bed Reservation"])
def create_bed_reservation(
    bed_reservation: create_bed_reservation_schema, db=Depends(get_db)
):
    bed_reservation = bed_reservation_model(**bed_reservation.model_dump())

    # check patient id in keycloak
    patient_id = bed_reservation.ID_patient
    user = keycloak_admin.get_user(patient_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    # check if room exists
    room = (
        db.query(room_model)
        .filter(room_model.ID_room == bed_reservation.ID_room)
        .first()
    )
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    # check if dates are valid
    if bed_reservation.Start_date > bed_reservation.End_date:
        raise HTTPException(
            status_code=400, detail="Start date cannot be after end date"
        )

    # check if patient already has a bed reservation this period
    existing_bed_reservations = (
        db.query(bed_reservation_model)
        .filter(bed_reservation_model.ID_patient == patient_id)
        .all()
    )
    for existing_bed_reservation in existing_bed_reservations:
        if (
            existing_bed_reservation.Start_date
            <= bed_reservation.Start_date
            <= existing_bed_reservation.End_date
        ) or (
            existing_bed_reservation.Start_date
            <= bed_reservation.End_date
            <= existing_bed_reservation.End_date
        ):
            raise HTTPException(
                status_code=400,
                detail="Patient already has a bed reservation for this period",
            )

    # check if room has available beds this period
    room = (
        db.query(room_model)
        .filter(room_model.ID_room == bed_reservation.ID_room)
        .first()
    )
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    bed_reservations = (
        db.query(bed_reservation_model)
        .filter(
            bed_reservation_model.ID_room == room.ID_room,
            or_(
                and_(
                    bed_reservation_model.Start_date <= bed_reservation.Start_date,
                    bed_reservation_model.End_date >= bed_reservation.Start_date,
                ),
                and_(
                    bed_reservation_model.Start_date <= bed_reservation.End_date,
                    bed_reservation_model.End_date >= bed_reservation.End_date,
                ),
            ),
        )
        .all()
    )

    if len(bed_reservations) >= room.Number_of_beds:
        raise HTTPException(status_code=400, detail="Room is full")

    bed_reservation.Bed_number = len(bed_reservations) + 1

    try:
        db.add(bed_reservation)
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while creating bed reservation."
        )

    return {"message": "Bed reservation added successfully."}


@app.get("/get/bed_reservation", tags=["Bed Reservation"])
def get_bed_reservation(
    patient_id: str = None,
    room_id: int = None,
    start_date: str = None,
    end_date: str = None,
    db=Depends(get_db),
):
    query = db.query(bed_reservation_model)

    if patient_id:
        query = query.filter(bed_reservation_model.ID_patient == patient_id)
    if room_id:
        query = query.filter(bed_reservation_model.ID_room == room_id)
    if start_date:
        query = query.filter(bed_reservation_model.Start_date >= start_date)
    if end_date:
        query = query.filter(bed_reservation_model.End_date <= end_date)

    bed_reservation = query.all()

    if bed_reservation is None:
        raise HTTPException(status_code=404, detail="Bed reservation not found")

    return bed_reservation


@app.get("/get/bed_reservations/all", tags=["Bed Reservation"])
def get_bed_reservations(db=Depends(get_db)):
    bed_reservations = db.query(bed_reservation_model).all()
    if bed_reservations is None:
        raise HTTPException(status_code=404, detail="Bed reservations not found")
    return bed_reservations


@app.patch("/update/bed_reservation_time/{reservation_id}", tags=["Bed Reservation"])
def update_bed_reservation_time(
    reservation_id: int,
    bed_reservation: update_bed_reservation_time_schema,
    db=Depends(get_db),
):
    existing_bed_reservation = (
        db.query(bed_reservation_model)
        .filter(bed_reservation_model.ID_reservation == reservation_id)
        .first()
    )
    if existing_bed_reservation is None:
        raise HTTPException(status_code=404, detail="Bed reservation not found")

    # check if dates are valid
    if bed_reservation.Start_date > bed_reservation.End_date:
        raise HTTPException(
            status_code=400, detail="Start date cannot be after end date"
        )

    # check if patient already has a bed reservation this period
    existing_bed_reservations = (
        db.query(bed_reservation_model)
        .filter(bed_reservation_model.ID_patient == existing_bed_reservation.ID_patient)
        .all()
    )
    for existing_bed_reservation in existing_bed_reservations:
        if (
            existing_bed_reservation.Start_date
            <= bed_reservation.Start_date
            <= existing_bed_reservation.End_date
        ) or (
            existing_bed_reservation.Start_date
            <= bed_reservation.End_date
            <= existing_bed_reservation.End_date
        ):
            raise HTTPException(
                status_code=400,
                detail="Patient already has a bed reservation for this period",
            )

    # check if room has available beds this period
    room = (
        db.query(room_model)
        .filter(room_model.ID_room == existing_bed_reservation.ID_room)
        .first()
    )
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    bed_reservations = (
        db.query(bed_reservation_model)
        .filter(
            bed_reservation_model.ID_room == room.ID_room,
            or_(
                and_(
                    bed_reservation_model.Start_date <= bed_reservation.Start_date,
                    bed_reservation_model.End_date >= bed_reservation.Start_date,
                ),
                and_(
                    bed_reservation_model.Start_date <= bed_reservation.End_date,
                    bed_reservation_model.End_date >= bed_reservation.End_date,
                ),
            ),
        )
        .all()
    )

    if len(bed_reservations) >= room.Number_of_beds:
        raise HTTPException(status_code=400, detail="Room is full")

    try:
        db.query(bed_reservation_model).filter(
            bed_reservation_model.ID_reservation == reservation_id
        ).update(bed_reservation.model_dump())
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while updating bed reservation."
        )


@app.delete("/delete/bed_reservation/{patient_id}", tags=["Bed Reservation"])
def delete_bed_reservation(patient_id: str, db=Depends(get_db)):
    bed_reservation = (
        db.query(bed_reservation_model)
        .filter(bed_reservation_model.ID_patient == patient_id)
        .first()
    )
    if bed_reservation is None:
        raise HTTPException(status_code=404, detail="Bed reservation not found")
    try:
        db.delete(bed_reservation)
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while deleting bed reservation."
        )
    return {"message": "Bed reservation deleted successfully."}


# ======================== Employee Management ========================
@app.get("/get/employee/all", tags=["Employee"])
def get_employees(db=Depends(get_db)):
    employees = db.query(employee_model).all()
    if not employees:
        raise HTTPException(status_code=404, detail="Employees not found")
    return employees


@app.get("/get/employee/id/{employee_id}", tags=["Employee"])
def get_employee(employee_id: int, db=Depends(get_db)):
    employee = (
        db.query(employee_model)
        .filter(employee_model.ID_employee == employee_id)
        .first()
    )
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@app.get("/get/employee/department/{department_id}", tags=["Employee"])
def get_employee_by_department(department_id: int, db=Depends(get_db)):
    employees = (
        db.query(employee_model)
        .filter(employee_model.Department_id == department_id)
        .all()
    )
    if not employees:
        raise HTTPException(status_code=404, detail="Employees not found")
    return employees


# ======================== Employee Schedule Management ========================
@app.get("/get/employee_schedule/all", tags=["Employee Schedule"])
def get_employee_schedules(db=Depends(get_db)):
    employee_schedules = db.query(employee_schedule_model).all()
    if not employee_schedules:
        raise HTTPException(status_code=404, detail="Employee schedules not found")
    return employee_schedules


@app.get("/get/employee_schedule/id/{schedule_id}", tags=["Employee Schedule"])
def get_employee_schedule(schedule_id: int, db=Depends(get_db)):
    employee_schedule = (
        db.query(employee_schedule_model)
        .filter(employee_schedule_model.ID_entry == schedule_id)
        .first()
    )
    if employee_schedule is None:
        raise HTTPException(status_code=404, detail="Employee schedule not found")
    return employee_schedule


@app.get("/get/employee_schedule/employee/{employee_id}", tags=["Employee Schedule"])
def get_employee_schedule_by_employee(employee_id: int, db=Depends(get_db)):
    employee_schedules = (
        db.query(employee_schedule_model)
        .filter(employee_schedule_model.ID_employee == employee_id)
        .all()
    )
    if not employee_schedules:
        raise HTTPException(status_code=404, detail="Employee schedules not found")
    return employee_schedules


@app.post("/create/employee_schedule", tags=["Employee Schedule"])
def create_employee_schedule(
    employee_schedule: create_employee_schedule_schema, db=Depends(get_db)
):
    employee_schedule = employee_schedule_model(**employee_schedule.model_dump())

    # check if employee exists
    employee = (
        db.query(employee_model)
        .filter(employee_model.ID_employee == employee_schedule.ID_employee)
        .first()
    )
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")

    try:
        db.add(employee_schedule)
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while adding employee schedule."
        )
    return {"message": "Employee schedule added successfully."}


@app.patch("/update/employee_schedule/{schedule_id}", tags=["Employee Schedule"])
def update_employee_schedule(
    schedule_id: int,
    employee_schedule: update_employee_schedule_schema,
    db=Depends(get_db),
):
    existing_employee_schedule = (
        db.query(employee_schedule_model)
        .filter(employee_schedule_model.ID_entry == schedule_id)
        .first()
    )
    if existing_employee_schedule is None:
        raise HTTPException(status_code=404, detail="Employee schedule not found")

    try:
        db.query(employee_schedule_model).filter(
            employee_schedule_model.ID_entry == schedule_id
        ).update(employee_schedule.model_dump())
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while updating employee schedule."
        )
    return {"message": "Employee schedule updated successfully."}


@app.delete("/delete/employee_schedule/{schedule_id}", tags=["Employee Schedule"])
def delete_employee_schedule(schedule_id: int, db=Depends(get_db)):
    employee_schedule = (
        db.query(employee_schedule_model)
        .filter(employee_schedule_model.ID_entry == schedule_id)
        .first()
    )
    if employee_schedule is None:
        raise HTTPException(status_code=404, detail="Employee schedule not found")
    try:
        db.delete(employee_schedule)
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while deleting employee schedule."
        )
    return {"message": "Employee schedule deleted successfully."}


# ======================== Medical Procedure Management ========================
@app.get("/get/medical_procedure/all", tags=["Medical Procedure"])
def get_medical_procedures(db=Depends(get_db)):
    medical_procedures = db.query(medical_procedure_model).all()
    if not medical_procedures:
        raise HTTPException(status_code=404, detail="Medical procedures not found")
    return medical_procedures


@app.get("/get/medical_procedure/id/{procedure_id}", tags=["Medical Procedure"])
def get_medical_procedure(procedure_id: int, db=Depends(get_db)):
    medical_procedure = (
        db.query(medical_procedure_model)
        .filter(medical_procedure_model.ID_procedure == procedure_id)
        .first()
    )
    if medical_procedure is None:
        raise HTTPException(status_code=404, detail="Medical procedure not found")
    return medical_procedure


@app.post("/create/medical_procedure", tags=["Medical Procedure"])
def create_medical_procedure(
    medical_procedure: create_medical_procedure_schema, db=Depends(get_db)
):
    medical_procedure = medical_procedure_model(**medical_procedure.model_dump())
    try:
        db.add(medical_procedure)
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while adding medical procedure."
        )
    return {"message": "Medical procedure added successfully."}


@app.patch("/update/medical_procedure/{procedure_id}", tags=["Medical Procedure"])
def update_medical_procedure(
    procedure_id: int,
    medical_procedure: update_medical_procedure_schema,
    db=Depends(get_db),
):
    existing_medical_procedure = (
        db.query(medical_procedure_model)
        .filter(medical_procedure_model.ID_procedure == procedure_id)
        .first()
    )
    if existing_medical_procedure is None:
        raise HTTPException(status_code=404, detail="Medical procedure not found")
    try:
        db.query(medical_procedure_model).filter(
            medical_procedure_model.ID_procedure == procedure_id
        ).update(medical_procedure.model_dump())
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while updating medical procedure."
        )
    return {"message": "Medical procedure updated successfully."}


@app.delete("/delete/medical_procedure/{procedure_id}", tags=["Medical Procedure"])
def delete_medical_procedure(procedure_id: int, db=Depends(get_db)):
    medical_procedure = (
        db.query(medical_procedure_model)
        .filter(medical_procedure_model.ID_procedure == procedure_id)
        .first()
    )
    if medical_procedure is None:
        raise HTTPException(status_code=404, detail="Medical procedure not found")
    try:
        db.delete(medical_procedure)
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while deleting medical procedure."
        )
    return {"message": "Medical procedure deleted successfully."}


# ======================== Surgical Plan Management ========================
@app.get("/get/surgical_plan/all", tags=["Surgical Plan"])
def get_surgical_plans(db=Depends(get_db)):
    surgical_plans = db.query(surgical_plan_model).all()
    if not surgical_plans:
        raise HTTPException(status_code=404, detail="Surgical plans not found")
    return surgical_plans


@app.get("/get/surgical_plan/id/{plan_id}", tags=["Surgical Plan"])
def get_surgical_plan(plan_id: int, db=Depends(get_db)):
    surgical_plan = (
        db.query(surgical_plan_model)
        .filter(surgical_plan_model.ID_plan == plan_id)
        .first()
    )
    if surgical_plan is None:
        raise HTTPException(status_code=404, detail="Surgical plan not found")
    return surgical_plan


@app.post("/create/surgical_plan", tags=["Surgical Plan"])
def create_surgical_plan(
    surgical_plan: create_surgical_plan_schema, db=Depends(get_db)
):
    surgical_plan = surgical_plan_model(**surgical_plan.model_dump())
    medical_personnel_string = " ".join(surgical_plan.Medical_personnel_list)

    medical_personnel_list = medical_personnel_string.split(" ")

    users = keycloak_admin.get_users()
    users_id_list = []
    for user in users:
        users_id_list.append(user["id"])

    for medical_personnel in medical_personnel_list:
        if medical_personnel not in users_id_list:
            raise HTTPException(status_code=404, detail="Medical personnel not found")

    surgical_plan.Medical_personnel_list = medical_personnel_string

    # check if medical procedure exists
    medical_procedure = (
        db.query(medical_procedure_model)
        .filter(medical_procedure_model.ID_procedure == surgical_plan.ID_procedure)
        .first()
    )
    if medical_procedure is None:
        raise HTTPException(status_code=404, detail="Medical procedure not found")

    try:
        db.add(surgical_plan)
        db.commit()
    except Exception:
        raise HTTPException(status_code=400, detail="Error while adding surgical plan.")
    return {"message": "Surgical plan added successfully."}


@app.patch("/update/surgical_plan/{plan_id}", tags=["Surgical Plan"])
def update_surgical_plan(
    plan_id: int, surgical_plan: update_surgical_plan_schema, db=Depends(get_db)
):
    existing_surgical_plan = (
        db.query(surgical_plan_model)
        .filter(surgical_plan_model.ID_plan == plan_id)
        .first()
    )
    if existing_surgical_plan is None:
        raise HTTPException(status_code=404, detail="Surgical plan not found")
    try:
        db.query(surgical_plan_model).filter(
            surgical_plan_model.ID_plan == plan_id
        ).update(surgical_plan.model_dump())
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while updating surgical plan."
        )
    return {"message": "Surgical plan updated successfully."}


@app.delete("/delete/surgical_plan/{plan_id}", tags=["Surgical Plan"])
def delete_surgical_plan(plan_id: int, db=Depends(get_db)):
    surgical_plan = (
        db.query(surgical_plan_model)
        .filter(surgical_plan_model.ID_plan == plan_id)
        .first()
    )
    if surgical_plan is None:
        raise HTTPException(status_code=404, detail="Surgical plan not found")
    try:
        db.delete(surgical_plan)
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while deleting surgical plan."
        )
    return {"message": "Surgical plan deleted successfully."}


# ======================== Material Resource Management ========================
@app.get("/get/material_resource/all/{department_id}", tags=["Material Resource"])
def get_material_resources(department_id: int, db=Depends(get_db)):
    material_resources = (
        db.query(material_resource_model)
        .filter(material_resource_model.Department_id == department_id)
        .all()
    )
    if not material_resources:
        raise HTTPException(status_code=404, detail="Material resources not found")
    return material_resources


@app.get("/get/material_resource/id/{resource_id}", tags=["Material Resource"])
def get_material_resource(resource_id: int, db=Depends(get_db)):
    material_resource = (
        db.query(material_resource_model)
        .filter(material_resource_model.ID_resource == resource_id)
        .first()
    )
    if material_resource is None:
        raise HTTPException(status_code=404, detail="Material resource not found")
    return material_resource


@app.get("/get/material_resource/name/{name}", tags=["Material Resource"])
def get_material_resource_by_name(resource_name: str, db=Depends(get_db)):
    material_resource = (
        db.query(material_resource_model)
        .filter(material_resource_model.Resource_name == resource_name)
        .all()
    )
    if material_resource is None:
        raise HTTPException(status_code=404, detail="Material resource not found")
    return material_resource


@app.post("/use/material_resource/{resource_id}", tags=["Material Resource"])
def use_material_resource(resource_id: int, quantity: int, db=Depends(get_db)):
    material_resource = (
        db.query(material_resource_model)
        .filter(material_resource_model.ID_resource == resource_id)
        .first()
    )
    if material_resource is None:
        raise HTTPException(status_code=404, detail="Material resource not found")

    if material_resource.Available_quantity < quantity:
        raise HTTPException(
            status_code=400, detail="Not enough material resource available"
        )

    material_resource.Available_quantity -= quantity
    # try:
    db.query(material_resource_model).filter(
        material_resource_model.ID_resource == resource_id
    ).update({"Available_quantity": material_resource.Available_quantity - quantity})
    db.commit()
    # except Exception:
    #     raise HTTPException(status_code=400, detail="Error while updating material resource.")
    return {"message": "Material resource used successfully."}


@app.post("/return/material_resource/{resource_id}", tags=["Material Resource"])
def return_material_resource(resource_id: int, quantity: int, db=Depends(get_db)):
    material_resource = (
        db.query(material_resource_model)
        .filter(material_resource_model.ID_resource == resource_id)
        .first()
    )
    if material_resource is None:
        raise HTTPException(status_code=404, detail="Material resource not found")

    material_resource.Available_quantity += quantity
    try:
        db.query(material_resource_model).filter(
            material_resource_model.ID_resource == resource_id
        ).update(
            {"Available_quantity": material_resource.Available_quantity + quantity}
        )
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while updating material resource."
        )
    return {"message": "Material resource returned successfully."}


@app.post("/create/material_resource", tags=["Material Resource"])
def create_material_resource(
    material_resource: create_material_resource_schema, db=Depends(get_db)
):
    material_resource = material_resource_model(**material_resource.model_dump())

    # check if department exists
    department = (
        db.query(department_model)
        .filter(department_model.ID_department == material_resource.Department_id)
        .first()
    )
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")

    # check if available quantity is valid
    if material_resource.Available_quantity < 0:
        raise HTTPException(
            status_code=400, detail="Available quantity cannot be negative"
        )

    try:
        db.add(material_resource)
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while adding material resource."
        )
    return {"message": "Material resource added successfully."}


@app.patch("/update/material_resource/{resource_id}", tags=["Material Resource"])
def update_material_resource(
    resource_id: int,
    material_resource: update_material_resource_schema,
    db=Depends(get_db),
):
    existing_material_resource = (
        db.query(material_resource_model)
        .filter(material_resource_model.ID_resource == resource_id)
        .first()
    )
    if existing_material_resource is None:
        raise HTTPException(status_code=404, detail="Material resource not found")

    # check if available quantity is valid
    if material_resource.Available_quantity < 0:
        raise HTTPException(
            status_code=400, detail="Available quantity cannot be negative"
        )

    # check if department exists
    department = (
        db.query(department_model)
        .filter(department_model.ID_department == material_resource.Department_id)
        .first()
    )
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")

    try:
        db.query(material_resource_model).filter(
            material_resource_model.ID_resource == resource_id
        ).update(material_resource.model_dump())
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while updating material resource."
        )
    return {"message": "Material resource updated successfully."}


@app.delete("/delete/material_resource/{resource_id}", tags=["Material Resource"])
def delete_material_resource(resource_id: int, db=Depends(get_db)):
    material_resource = (
        db.query(material_resource_model)
        .filter(material_resource_model.ID_resource == resource_id)
        .first()
    )
    if material_resource is None:
        raise HTTPException(status_code=404, detail="Material resource not found")
    try:
        db.delete(material_resource)
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while deleting material resource."
        )
    return {"message": "Material resource deleted successfully."}


# ======================== Operating Room Management ========================
@app.post("/create/operating_room", tags=["Operating Room"])
def create_operating_room(
    operating_room: create_operating_room_schema, db=Depends(get_db)
):
    # check if department exists
    department = (
        db.query(department_model)
        .filter(department_model.ID_department == operating_room.ID_department)
        .first()
    )
    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")

    operating_room = operating_room_model(**operating_room.model_dump())
    try:
        db.add(operating_room)
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {"message": "Operating room added successfully."}


@app.get("/get/operating_room/all", tags=["Operating Room"])
def get_operating_rooms(db=Depends(get_db)):
    operating_rooms = db.query(operating_room_model).all()
    if not operating_rooms:
        raise HTTPException(status_code=404, detail="Operating rooms not found")
    return operating_rooms


@app.get("/get/operating_room/id/{room_id}", tags=["Operating Room"])
def get_operating_room_by_id(room_id: int, db=Depends(get_db)):
    operating_room = (
        db.query(operating_room_model)
        .filter(operating_room_model.ID_operating_room == room_id)
        .first()
    )
    if operating_room is None:
        raise HTTPException(status_code=404, detail="Operating room not found")
    return operating_room


@app.delete("/delete/operating_room/{room_id}", tags=["Operating Room"])
def delete_operating_room(room_id: int, db=Depends(get_db)):
    operating_room = (
        db.query(operating_room_model)
        .filter(operating_room_model.ID_operating_room == room_id)
        .first()
    )
    if operating_room is None:
        raise HTTPException(status_code=404, detail="Operating room not found")
    try:
        db.delete(operating_room)
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while deleting operating room."
        )
    return {"message": "Operating room deleted successfully."}


# ======================== Operating Room Reservation Management ========================
@app.post("/create/operating_room_reservation", tags=["Operating Room Reservation"])
def create_operating_room_reservation(
    operating_room_reservation: create_operating_room_reservation_schema,
    db=Depends(get_db),
):
    operating_room_reservation = operating_room_reservation_model(
        **operating_room_reservation.model_dump()
    )

    # check if operating room exists
    operating_room = (
        db.query(operating_room_model)
        .filter(
            operating_room_model.ID_operating_room
            == operating_room_reservation.ID_operating_room
        )
        .first()
    )

    operating_room_model.Start_time = operating_room_reservation.Start_time.strftime(
        "%H:%M"
    )
    operating_room_model.End_time = operating_room_reservation.End_time.strftime(
        "%H:%M"
    )

    if operating_room is None:
        raise HTTPException(status_code=404, detail="Operating room not found")

    # check if dates are valid
    if operating_room_reservation.Start_time > operating_room_reservation.End_time:
        raise HTTPException(
            status_code=400, detail="Start time cannot be after end time"
        )

    # check if operating room is available this period
    operating_room_reservations = (
        db.query(operating_room_reservation_model)
        .filter(
            operating_room_reservation_model.ID_operating_room
            == operating_room_reservation.ID_operating_room
        )
        .all()
    )
    for reservation in operating_room_reservations:
        if (
            reservation.Start_time
            <= operating_room_reservation.Start_time
            <= reservation.End_time
        ):
            raise HTTPException(
                status_code=400, detail="Operating room is reserved for this period"
            )

    try:
        db.add(operating_room_reservation)
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while creating operating room reservation."
        )
    return {"message": "Operating room reservation added successfully."}


@app.get("/get/operating_room_reservations/all", tags=["Operating Room Reservation"])
def get_operating_room_reservations(db=Depends(get_db)):
    operating_room_reservations = db.query(operating_room_reservation_model).all()
    if not operating_room_reservations:
        raise HTTPException(
            status_code=404, detail="Operating room reservations not found"
        )
    return operating_room_reservations


@app.get(
    "/get/operating_room_reservation/{reservation_id}",
    tags=["Operating Room Reservation"],
)
def get_operating_room_reservation(reservation_id: int, db=Depends(get_db)):
    operating_room_reservation = (
        db.query(operating_room_reservation_model)
        .filter(operating_room_reservation_model.ID_reservation == reservation_id)
        .first()
    )
    if operating_room_reservation is None:
        raise HTTPException(
            status_code=404, detail="Operating room reservation not found"
        )
    return operating_room_reservation


@app.get(
    "/get/operating_room_reservations/room/{room_id}",
    tags=["Operating Room Reservation"],
)
def get_operating_room_reservations_by_room(room_id: int, db=Depends(get_db)):
    operating_room_reservations = (
        db.query(operating_room_reservation_model)
        .filter(operating_room_reservation_model.ID_operating_room == room_id)
        .all()
    )
    if operating_room_reservations is None:
        raise HTTPException(
            status_code=404, detail="Operating room reservations not found"
        )
    return operating_room_reservations


@app.patch(
    "/update/operating_room_reservation/{reservation_id}",
    tags=["Operating Room Reservation"],
)
def update_operating_room_reservation(
    reservation_id: int,
    operating_room_reservation: update_operating_room_reservation_schema,
    db=Depends(get_db),
):
    existing_operating_room_reservation = (
        db.query(operating_room_reservation_model)
        .filter(operating_room_reservation_model.ID_reservation == reservation_id)
        .first()
    )
    if existing_operating_room_reservation is None:
        raise HTTPException(
            status_code=404, detail="Operating room reservation not found"
        )

    # check if dates are valid
    if operating_room_reservation.Start_time > operating_room_reservation.End_time:
        raise HTTPException(
            status_code=400, detail="Start time cannot be after end time"
        )

    # check if operating room is available this period
    operating_room_reservations = (
        db.query(operating_room_reservation_model)
        .filter(
            operating_room_reservation_model.ID_operating_room
            == existing_operating_room_reservation.ID_operating_room
        )
        .all()
    )
    for reservation in operating_room_reservations:
        if (
            reservation.Start_time
            <= operating_room_reservation.Start_time
            <= reservation.End_time
        ):
            raise HTTPException(
                status_code=400, detail="Operating room is reserved for this period"
            )

    try:
        db.query(operating_room_reservation_model).filter(
            operating_room_reservation_model.ID_reservation == reservation_id
        ).update(operating_room_reservation.model_dump())
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while updating operating room reservation."
        )
    return {"message": "Operating room reservation updated successfully."}


@app.delete(
    "/delete/operating_room_reservation/{reservation_id}",
    tags=["Operating Room Reservation"],
)
def delete_operating_room_reservation(reservation_id: int, db=Depends(get_db)):
    operating_room_reservation = (
        db.query(operating_room_reservation_model)
        .filter(operating_room_reservation_model.ID_reservation == reservation_id)
        .first()
    )
    if operating_room_reservation is None:
        raise HTTPException(
            status_code=404, detail="Operating room reservation not found"
        )
    try:
        db.delete(operating_room_reservation)
        db.commit()
    except Exception:
        raise HTTPException(
            status_code=400, detail="Error while deleting operating room reservation."
        )
    return {"message": "Operating room reservation deleted successfully."}
