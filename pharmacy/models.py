import datetime

from sqlalchemy import Column, Date, Float, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class Medication(Base):
    __tablename__ = "Medications"

    ID_medication = Column(Integer, primary_key=True)
    Medication_name = Column(String)
    Active_substance = Column(String)
    Form = Column(String)
    Manufacturer = Column(String)
    Price = Column(Float)


class Prescription(Base):
    __tablename__ = "Prescriptions"

    ID_prescription = Column(Integer, primary_key=True)
    ID_patient = Column(String)
    ID_doctor = Column(String)
    Prescription_date = Column(Date, default=datetime.datetime.now)


class PrescriptionMedication(Base):
    __tablename__ = "Prescription_Medications"

    ID_prescription = Column(
        Integer, ForeignKey("Prescriptions.ID_prescription"), primary_key=True
    )
    ID_medication = Column(
        Integer, ForeignKey("Medications.ID_medication"), primary_key=True
    )
    Quantity = Column(Integer)
    Dosage = Column(String)

    prescription = relationship("Prescription")
    medication = relationship("Medication")
