from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Department(Base):
    __tablename__ = 'Departments'
    ID_department = Column(Integer, primary_key=True)
    Department_name = Column(String)
    Description = Column(String)
    Contact_info = Column(String)

class Room(Base):
    __tablename__ = 'Room'
    ID_room = Column(Integer, primary_key=True)
    ID_department = Column(Integer, ForeignKey('Departments.ID_department'))
    Number_of_beds = Column(Integer)

class BedReservation(Base):

    __tablename__ = 'Bed_Reservations'
    ID_reservation = Column(Integer, primary_key=True)
    ID_patient = Column(Integer)
    ID_room = Column(Integer, ForeignKey('Room.ID_room'))
    Start_date = Column(Date)
    End_date = Column(Date)

class Employee(Base):
    __tablename__ = 'Employees'
    ID_employee = Column(Integer, primary_key=True)
    First_name = Column(String)
    Last_name = Column(String)
    Employment_date = Column(Date)
    Position = Column(String)
    Department_id = Column(Integer, ForeignKey('Departments.ID_department'))
    department = relationship("Department")

class EmployeeSchedule(Base):
    __tablename__ = 'Employee_Schedules'
    ID_entry = Column(Integer, primary_key=True)
    ID_employee = Column(Integer, ForeignKey('Employees.ID_employee'))
    Date = Column(Date)
    Start_time = Column(Time)
    End_time = Column(Time)

class MedicalProcedure(Base):
    __tablename__ = 'Medical_Procedures'
    ID_procedure = Column(Integer, primary_key=True)
    Procedure_name = Column(String)
    Description = Column(String)
    Costs = Column(String)
    Related_departments = Column(String)

class SurgicalPlan(Base):
    __tablename__ = 'Surgical_Plans'
    ID_plan = Column(Integer, primary_key=True)
    ID_procedure = Column(Integer, ForeignKey('Medical_Procedures.ID_procedure'))
    Operation_date = Column(Date)
    Start_time = Column(Time)
    End_time = Column(Time)
    Operating_room = Column(String)
    Medical_personnel_list = Column(String)

class MaterialResource(Base):
    __tablename__ = 'Material_Resources'
    ID_resource = Column(Integer, primary_key=True)
    Resource_name = Column(String)
    Description = Column(String)
    Available_quantity = Column(Integer)
    Department_id = Column(Integer, ForeignKey('Departments.ID_department'))
    department = relationship("Department")
