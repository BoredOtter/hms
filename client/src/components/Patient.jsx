import React from 'react'
import ObjectSlicer from './utils/ObjectSlicer'
import ObjectDetails from './utils/ObjectDetails'
import PatientHistory from './PatientHistory'
import PatientVitals from './PatientVitals'
import PatientPrescriptions from './PatientPrescriptions'
import bodyButton from './utils/bodyButton'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import PatientInfo from './PatientInfo'



const Patient = ({patient}) => {


  const [showVitals, setShowVitals] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  

  const handleShowVitals = () => {
    setShowVitals(!showVitals);
    setShowHistory(false);
    setEditing(false);
    setShowPrescriptions(false);
  };

  const handleShowHistory = () => {
    setShowVitals(false);
    setShowHistory(!showHistory);
    setEditing(false);
    setShowPrescriptions(false);
  };

  const handleEditing = () => {
    setShowVitals(false);
    setShowHistory(false);
    setEditing(!editing);
    setShowPrescriptions(false);
  };

  const handleShowPrescriptions = () => {
    setShowVitals(false);
    setShowHistory(false);
    setEditing(false);
    setShowPrescriptions(!showPrescriptions);
  }


  return (
    <>
      <ObjectDetails title={"Patient Details"}>
          <>
            <ObjectSlicer object={patient}/>
            <div className='grid grid-cols-2 gap-4 items-center mb-4'>
              <button onClick={handleShowVitals} className={bodyButton}>Vitals</button>
              <button onClick={handleShowHistory} className={bodyButton}>History</button>
              <button onClick={handleShowPrescriptions} className={bodyButton}>Prescriptions</button>
              <button onClick={handleEditing} className={bodyButton}>Change Info</button>
            </div>
            <NavLink to={`/patients`} className={`${bodyButton} pt-2.5`}>Back</NavLink>
          </>

      </ObjectDetails>
      {editing && <PatientInfo patient={patient}/>}
      {showVitals && <PatientVitals patient={patient} />}
      {showHistory && <PatientHistory patient_id={patient.PESEL} />}
      {showPrescriptions && <PatientPrescriptions/>}
    </>
  );
};

export default Patient
