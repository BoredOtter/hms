import React from 'react'
import patients from '../../patients.json'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Patient from '../components/Patient';

const PatientPage = () => {
  const {id} = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const foundPatient = patients.patients.find(patient => patient.id === id);
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
