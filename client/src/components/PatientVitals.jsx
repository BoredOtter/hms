import React, { useState, useEffect } from 'react';
import ObjectsListing from './listing/ObjectsListing';
import ObjectDetails from './utils/ObjectDetails';
import bodyButton from './utils/bodyButton';
import WarningInfo from '../pages/WarningInfo';
import httpPatients from '../client/httpPatients';
import formInput from './utils/formInput';
import formLabel from './utils/formLabel';

const PatientVitals = ({patient_id}) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const [vitals, setVitals] = useState([])
  const [prevSumbitted, setPrevSumbitted] = useState(false);

    useEffect(() => { 
        const fetchVitals = async () => {
            try {
              const response = await httpPatients.get(`/get_vitals/${patient_id}`,{params : {all_vitals: true}});
              setVitals(response.data);
            } catch (error) {
                <WarningInfo info={"Failed to fetch patient vitals"}/>
            }
        };

        fetchVitals();
        return () => {
        };
    }, []);

  return (
    <>
      <ObjectsListing objectsData={vitals} objectsTitle={"Vitals History"} objectKey={"ID_measurement"}/>
    </>
  );
};

export default PatientVitals;
