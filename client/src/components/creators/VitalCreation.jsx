import React from 'react'
import { useState } from 'react';
import formInput from '../utils/formInput';
import formLabel from '../utils/formLabel';
import httpPatients from '../../client/httpPatients';
import ObjectDetails from '../utils/ObjectDetails';
import bodyButton from '../utils/bodyButton';

const currentDate = new Date().toISOString().split('T')[0];
const VitalCreation = ({patient_id}) => {

    const [prevSumbitted, setPrevSumbitted] = useState(false);
    const [newVital, setNewVital] = useState({
        Date_and_time_of_measurement: currentDate,
        Blood_pressure: '',
        Pulse: '',
        Body_temperature: '',
        Blood_sugar_level: '',
        Other_medical_parameters: ''
      });
    
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVital({ ...newVital, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        
        for (const key in newVital) {
          if (newVital[key] === '') {
              alert("Please fill in all fields before submitting.");
              return;
          }
        }
        
        try {
            await httpPatients.post(`/add_vitals/${patient_id}`, newVital);
            setPrevSumbitted(!prevSumbitted);
            alert("Vitals added successfully!");
            setNewVital({
                Date_and_time_of_measurement: currentDate,
                Blood_pressure: '',
                Pulse: '',
                Body_temperature: '',
                Blood_sugar_level: '',
                Other_medical_parameters: ''
            });
        } catch (error) {
            alert(error.response.data.detail)
        }
      };
  return (
    <ObjectDetails title={"Patient Vitals"}>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className={formLabel}>Blood Pressure:</label>
                <input
                  type="text"
                  name="Blood_pressure"
                  value={newVital.Blood_pressure}
                  onChange={handleInputChange}
                  className={formInput}
                  placeholder="Blood Pressure"
                />
              </div>
              <div>
                <label className={formLabel}>Pulse:</label>
                <input
                  type="text"
                  name="Pulse"
                  value={newVital.Pulse}
                  onChange={handleInputChange}
                  className={formInput}
                  placeholder="Pulse"
                />
              </div>
              <div>
                <label className={formLabel}>Body Temperature:</label>
                <input
                  type="text"
                  name="Body_temperature"
                  value={newVital.Body_temperature}
                  onChange={handleInputChange}
                  className={formInput}
                  placeholder="Body Temperature"
                />
              </div>
              <div>
                <label className={formLabel}>Blood Sugar Level:</label>
                <input
                  type="text"
                  name="Blood_sugar_level"
                  value={newVital.Blood_sugar_level}
                  onChange={handleInputChange}
                  className={formInput}
                  placeholder="Blood Sugar Level"
                />
              </div>
            <div>
                <label className={formLabel}>Other Parameters:</label>
                <input
                  type="text"
                  name="Other_medical_parameters"
                  value={newVital.Other_medical_parameters}
                  onChange={handleInputChange}
                  className={formInput}
                  placeholder="Other Medical Parameters"
                />
              </div>
            <button type="submit" onClick={handleSubmit} className={bodyButton}>Save</button>
          </form>
      </ObjectDetails>
  )
}

export default VitalCreation
