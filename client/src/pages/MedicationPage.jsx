import React from 'react'
import medications from '../../medications.json'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MedicationInfo from '../components/MedicationInfo';


const MedicationPage = () => {
  const {id} = useParams();
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundMedication = medications.find(medication => medication.ID_medication === parseInt(id));
    if (foundMedication) {
        setMedication(foundMedication);
        setLoading(false);
    }
  }, [id]);

  return (
    !loading ? <MedicationInfo medication={medication}></MedicationInfo>
    : null
  );
}

export default MedicationPage
