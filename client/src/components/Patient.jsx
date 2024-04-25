import React from 'react'
import ObjectSlicer from './utils/ObjectSlicer'
import ObjectDetails from './utils/ObjectDetails'
import PatientHistory from './PatientHistory'
import PatientVitals from './PatientVitals'
import PatientPrescriptions from './PatientPrescriptions'
import bodyButton from './utils/bodyButton'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'



const Patient = ({patient}) => {


  const [showVitals, setShowVitals] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  

  const handleShowVitals = () => {
    setShowVitals(!showVitals);
    setShowHistory(false);
    setShowPrescriptions(false);
  };

  const handleShowHistory = () => {
    setShowVitals(false);
    setShowHistory(!showHistory);
    setShowPrescriptions(false);
  };

  const handleEditing = () => {
    setShowVitals(false);
    setShowHistory(false);
    setShowPrescriptions(false);
  };

  const handleShowPrescriptions = () => {
    setShowVitals(false);
    setShowHistory(false);
    setShowPrescriptions(!showPrescriptions);
  }


  return (
    <>
      <ObjectDetails>
          <>
            <div className='grid grid-cols-2 gap-4 items-center mb-4'>
              <button onClick={handleShowVitals} className={bodyButton}>Vitals</button>
              <button onClick={handleShowHistory} className={bodyButton}>History</button>
              <button onClick={handleShowPrescriptions} className={bodyButton}>Prescriptions</button>
              <NavLink to={`/patients`} className={`${bodyButton} pt-2.5`}>Back</NavLink>
            </div>
          </>

      </ObjectDetails>
      {showVitals && <PatientVitals patient_id={patient.Patient_uuid} />}
      {showHistory && <PatientHistory patient_id={patient.Patient_uuid} />}
      {showPrescriptions && <PatientPrescriptions patient_id={patient.Patient_uuid}/>}
    </>
  );
};

export default Patient
