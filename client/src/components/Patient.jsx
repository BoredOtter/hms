import React from 'react'
import ObjectSlicer from './utils/ObjectSlicer'
import ContainerDetails from './utils/ContainerDetails'
import PatientHistory from './PatientHistory'
import PatientVitals from './PatientVitals'
import { NavLink } from 'react-router-dom'
import bodyButton from './utils/bodyButton'
import { useState } from 'react'

const Patient = ({patient}) => {

  const [showVitals, setShowVitals] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleShowVitals = () => {
    setShowVitals(!showVitals);
    setShowHistory(false);
  };

  const handleShowHistory = () => {
    setShowVitals(false);
    setShowHistory(!showHistory);
  };

  return (
    <>
      <ContainerDetails title={"Patient Details"}>
        <ObjectSlicer object={patient}/>
        <div className='space-x-2 text-center'>
          <button onClick={handleShowVitals} className={bodyButton}>Vitals</button>
          <button onClick={handleShowHistory} className={bodyButton}>History</button>
          <NavLink
                to={`/patients`}
                className={`${bodyButton} pt-3`}>
                Back
            </NavLink>
        </div>
      </ContainerDetails>
      
      {showVitals && <PatientVitals patient={patient} />}
      {showHistory && <PatientHistory patient={patient} />}
    </>
  );
};

export default Patient
