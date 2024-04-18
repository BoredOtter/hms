import React from 'react'
import patients from '../../patients.json'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Patient from '../components/Patient';
import WarningInfo from './WarningInfo';

const PatientPage = () => {
  const {id} = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const foundPatient = patients.patients.find(patient => patient.PESEL === id);
    if (foundPatient) {
      setPatient(foundPatient);
      setLoading(false);
    }
  }, [id]);

  return (
    !loading ? <Patient patient={patient}/>
    : null
  );
};

export  { PatientPage as default}
