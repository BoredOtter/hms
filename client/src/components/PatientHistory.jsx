import React from 'react'
import ObjectsListing from './listing/ObjectsListing'
import bodyButton from './utils/bodyButton';
import { useState, useEffect } from 'react'
import ObjectDetails from './utils/ObjectDetails';
import httpPatients from '../client/httpPatients';
import formInput from './utils/formInput';
import formLabel from './utils/formLabel';

const currentDate = new Date().toISOString().split('T')[0];

const PatientHistory = ({patient_id}) => {

  const [historyData, setHistoryData] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    Diagnosis: '',
    Prescribed_medicines: '',
    Entry_date: currentDate,
    Description_of_disease_or_health_problem: '',
    Patient_uuid: patient_id,
    Doctor_notes: ''
  });

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const response = await httpPatients.get(`get_medical_history/${patient_id}`);
        setHistoryData(response.data || []);
      } catch (error) {
        console.error('Error fetching medical history:', error);
      }
    };

    fetchMedicalHistory();
  }, []);

  return (
    <>
      <ObjectsListing objectsData={historyData} objectsTitle={"Medical History"} objectKey={"ID_entry"}></ObjectsListing>
    </>
  );
}

export default PatientHistory
