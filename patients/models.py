from sqlalchemy import Column, Date, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Patient(Base):
    __tablename__ = "Patients"
    Patient_uuid = Column(String, primary_key=True)
    First_name = Column(String)
    Last_name = Column(String)
    Date_of_birth = Column(Date)
    Gender = Column(String)
    Contact_number = Column(String, nullable=True)
    Address = Column(String, nullable=True)
    PESEL = Column(String)


class MedicalHistory(Base):
    __tablename__ = "Medical_History"
    ID_entry = Column(Integer, primary_key=True)
    Patient_uuid = Column(String, ForeignKey("Patients.Patient_uuid"))
    Entry_date = Column(Date)
    Diagnosis = Column(String)
    Description_of_disease_or_health_problem = Column(String, nullable=True)
    Prescribed_medicines = Column(String, nullable=True)
    Doctor_notes = Column(String, nullable=True)


class VitalSigns(Base):
    __tablename__ = "Vital_Signs"
    ID_measurement = Column(Integer, primary_key=True)
    Patient_uuid = Column(String, ForeignKey("Patients.Patient_uuid"))
    Date_and_time_of_measurement = Date
    Blood_pressure = Column(String, nullable=True)
    Pulse = Column(String, nullable=True)
    Body_temperature = Column(String, nullable=True)
    Blood_sugar_level = Column(String, nullable=True)
    Other_medical_parameters = Column(String, nullable=True)
