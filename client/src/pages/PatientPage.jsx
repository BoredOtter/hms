import React from 'react'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import bodyButton from '../components/utils/bodyButton';
import { NavLink } from 'react-router-dom';
import PatientHistory from '../components/PatientHistory';
import PatientVitals from '../components/PatientVitals';
import PatientPrescriptions from '../components/PatientPrescriptions';
import PatientInfo from '../components/PatientInfo';
import VitalCreation from '../components/creators/VitalCreation';
import PrescriptionCreation from '../components/creators/PrescriptionCreation';
import ConditionCreation from '../components/creators/ConditionCreation';
import PatientBedReservationCreation from '../components/creators/PatientBedReservationCreation';

const PatientPage = () => {
  const {id} = useParams();
  const [activeSection, setActiveSection] = useState("info");
  const handleSetActiveSection = (section) => {
    setActiveSection(section);
  };

  return (
    <>
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2'>
      <button onClick={() => handleSetActiveSection("vitals")} className={bodyButton}>Vitals</button>
      <button onClick={() => handleSetActiveSection("history")} className={bodyButton}>History</button>
      <button onClick={() => handleSetActiveSection("prescriptions")} className={bodyButton}>Prescriptions</button>
      <button onClick={() => handleSetActiveSection("info")} className={bodyButton}>Info</button>
      <button onClick={() => handleSetActiveSection("addVital")} className={bodyButton}>Add Vital</button>
      <button onClick={() => handleSetActiveSection("addMedicalCondition")} className={bodyButton}>Add Condition</button>
      <button onClick={() => handleSetActiveSection("addPrescription")} className={bodyButton}>Add Prescription</button>
      <NavLink to={`/patients`} className={`${bodyButton} pt-2.5`}>Back</NavLink>
    </div>

    {activeSection === "vitals" && <PatientVitals patient_id={id} />}
    {activeSection === "history" && <PatientHistory patient_id={id} />}
    {activeSection === "prescriptions" && <PatientPrescriptions patient_id={id} />}
    {activeSection === "info" && 
    <>
    <PatientInfo patient_id={id} />
    </>}
    {activeSection === "addVital" && <VitalCreation patient_id={id} />}
    {activeSection === "addMedicalCondition" && <ConditionCreation patient_id={id} />}
    {activeSection === "addPrescription" && <PrescriptionCreation patient_id={id} />}
    
    </>
  );
    
  
};

export  { PatientPage as default}
