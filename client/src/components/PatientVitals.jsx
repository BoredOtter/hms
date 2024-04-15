import React, { useState } from 'react';
import ObjectListing from './listing/ObjectListing';
import ContainerDetails from './utils/ContainerDetails';
import bodyButton from './utils/bodyButton';
import vital_signs from '../../vital_signs.json';

const PatientVitals = () => {
  const vitals = vital_signs || [];

  const [showAddVitals, setShowAddVitals] = useState(false);
  const [showLastVitals, setShowLastVitals] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleShowLastVitals = () => {
    setShowAddVitals(false);
    setShowHistory(false);
    setShowLastVitals(!showLastVitals);
  };

  const handleShowAddVitals = () => {
    setShowLastVitals(false);
    setShowHistory(false);
    setShowAddVitals(!showAddVitals);
  };

  const handleShowHistory = () => {
    setShowLastVitals(false);
    setShowHistory(!showHistory);
    setShowAddVitals(false);
  };

  return (
    <>
      <ContainerDetails title={"Patient Vitals"}>
        <div className='text-center space-x-2 mt-3 '>
          <button onClick={handleShowAddVitals} className={bodyButton}>Add Vital</button>
          <button onClick={handleShowLastVitals} className={bodyButton}>Last Vital</button>
          <button onClick={handleShowHistory} className={bodyButton}>History</button>
        </div>

        {showLastVitals && (
          <div key={vitals.examination_id} className='mt-5'>
            <ObjectListing object={vitals} />
          </div>
        )}
      </ContainerDetails>
    </>
  );
};

export default PatientVitals;
