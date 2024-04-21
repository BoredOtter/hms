import React from 'react'
import history from '../../history.json'
import ObjectsListing from './listing/ObjectsListing'
import bodyButton from './utils/bodyButton';
import { useState } from 'react'
import ObjectDetails from './utils/ObjectDetails';

const PatientHistory = ({patient_id}) => {

  const inputStyle = "w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2";
  const labelStyle = "block font-semibold text-gray-700 mb-1";

  const historyData = history || [];

  const [formData, setFormData] = useState({
    Diagnosis: '',
    Prescribed_medicines: '',
    Entry_date: '',
    Description_of_disease_or_health_problem: '',
    Patient_uuid: patient_id,
    Doctor_notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split('T')[0];
    setFormData({ ...formData, Entry_date: currentDate });
    console.log(formData)
    
  };

  return (
    <>
      <ObjectDetails title={"Medical Condition"}>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 mt-10">
            <div>
              <label className={labelStyle}>Diagnosis:</label>
              <input
                type="text"
                name="Diagnosis"
                value={formData.Diagnosis}
                onChange={handleInputChange}
                className={inputStyle}
                placeholder="Diagnosis"
              />
            </div>
            <div>
              <label className={labelStyle}>Prescribed Medicines:</label>
              <input
                type="text"
                name="Prescribed_medicines"
                value={formData.Prescribed_medicines}
                onChange={handleInputChange}
                className={inputStyle}
                placeholder="Prescribed Medicines"
              />
            </div>
            <div>
              <label className={labelStyle}>Description of Disease:</label>
              <input
                type="text"
                name="Description_of_disease_or_health_problem"
                value={formData.Description_of_disease_or_health_problem}
                onChange={handleInputChange}
                className={inputStyle}
                placeholder="Description"
              />
            </div>
            <div>
              <label className={labelStyle}>Doctor Notes:</label>
              <input
                type="text"
                name="Doctor_notes"
                value={formData.Doctor_notes}
                onChange={handleInputChange}
                className={inputStyle}
                placeholder="Doctor Notes"
              />
            </div>
          </div>
          <button type="submit" className={bodyButton}>Save</button>
        </form>
        </ObjectDetails>
      <ObjectsListing objectsData={historyData} objectsTitle={"Medical History"} objectKey={"ID_entry"}></ObjectsListing>
    </>
  );
}

export default PatientHistory
