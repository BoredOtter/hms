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
    }, [prevSumbitted]);


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

    
    console.log(newVital)
    for (const key in newVital) {
      if (newVital[key] === '') {
          alert("Please fill in all fields before submitting.");
          return;
      }
    }
    
    try {
        const response = await httpPatients.post(`/add_vitals/${patient_id}`, newVital);
        setPrevSumbitted(!prevSumbitted);
        setNewVital({
            Date_and_time_of_measurement: currentDate,
            Blood_pressure: '',
            Pulse: '',
            Body_temperature: '',
            Blood_sugar_level: '',
            Other_medical_parameters: ''
        });
    } catch (error) {
        console.error('Error adding new vital:', error);
    }
  };


  return (
    <>
      <ObjectDetails title={"Patient Vitals"}>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 mt-10">
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
      <ObjectsListing objectsData={vitals} objectsTitle={"Vitals History"} objectKey={"ID_measurement"}/>
    </>
  );
};

export default PatientVitals;
