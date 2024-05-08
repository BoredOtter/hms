import React from 'react'
import { useState } from 'react';
import httpPatients from '../../client/httpPatients';
import ObjectDetails from '../utils/ObjectDetails'
import formLabel from '../utils/formLabel'
import formInput from '../utils/formInput';
import bodyButton from '../utils/bodyButton';
import currentDate from '../utils/currentDate';



const ConditionCreation = ({patient_id}) => {
    const [formData, setFormData] = useState({
        Diagnosis: '',
        Prescribed_medicines: '',
        Entry_date: currentDate,
        Description_of_disease_or_health_problem: '',
        Patient_uuid: patient_id,
        Doctor_notes: ''
      });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        setFormData({ ...formData, Entry_date: currentDate }); // Set Entry_date before checking for empty fields
        for (const key in formData) {
          if (formData[key] === '') {
            alert("Please fill in all fields before submitting.");
            return;
          }
        }
      
        try {
          await httpPatients.post(`add_medical_history/${patient_id}`, formData);
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
    <ObjectDetails title={"Medical Condition"}>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="justify-center text-center items-center">
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
                  <label className={formLabel}>Medicines:</label>
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
                  <label className={formLabel}>Description:</label>
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
  )
}

export default ConditionCreation
