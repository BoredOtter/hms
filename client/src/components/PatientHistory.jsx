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
  }, [submitted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setFormData({ ...formData, Entry_date: currentDate }); // Set Entry_date before checking for empty fields
    console.log(formData)
    for (const key in formData) {
      if (formData[key] === '') {
        alert("Please fill in all fields before submitting.");
        return;
      }
    }
  
    try {
      const response = await httpPatients.post(`add_medical_history/${patient_id}`, formData);
      alert("Medical condition added successfully!");
      setSubmitted(!submitted);
      setFormData({Diagnosis: '',
      Prescribed_medicines: '',
      Entry_date: currentDate,
      Description_of_disease_or_health_problem: '',
      Patient_uuid: patient_id,
      Doctor_notes: ''});
    } catch (error) {
      console.error('Error adding medical history:', error);
    }
  };
  

  return (
    <>
      <ObjectDetails title={"Medical Condition"}>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={formLabel}>Diagnosis:</label>
              <input
                type="text"
                name="Diagnosis"
                value={formData.Diagnosis}
                onChange={handleInputChange}
                className={formInput}
                placeholder="Diagnosis"
              />
            </div>
            <div>
              <label className={formLabel}>Prescribed Medicines:</label>
              <input
                type="text"
                name="Prescribed_medicines"
                value={formData.Prescribed_medicines}
                onChange={handleInputChange}
                className={formInput}
                placeholder="Prescribed Medicines"
              />
            </div>
            <div>
              <label className={formLabel}>Description of Disease:</label>
              <input
                type="text"
                name="Description_of_disease_or_health_problem"
                value={formData.Description_of_disease_or_health_problem}
                onChange={handleInputChange}
                className={formInput}
                placeholder="Description"
              />
            </div>
            <div>
              <label className={formLabel}>Doctor Notes:</label>
              <input
                type="text"
                name="Doctor_notes"
                value={formData.Doctor_notes}
                onChange={handleInputChange}
                className={formInput}
                placeholder="Doctor Notes"
              />
            </div>
          </div>
          <button type="submit" onClick={handleSubmit} className={bodyButton}>Save</button>
        </form>
        </ObjectDetails>
      <ObjectsListing objectsData={historyData} objectsTitle={"Medical History"} objectKey={"ID_entry"}></ObjectsListing>
    </>
  );
}

export default PatientHistory
