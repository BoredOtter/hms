import React, { useState } from 'react';
import ObjectsListing from './listing/ObjectsListing';
import ObjectDetails from './utils/ObjectDetails';
import bodyButton from './utils/bodyButton';
import vital_signs from '../../vital_signs.json';
import Patient from './Patient';

const PatientVitals = () => {

  const inputStyle = "w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-2";
  const labelStyle = "block font-semibold text-gray-700 mb-1";
  const vitals = vital_signs || [];


  const [newVital, setNewVital] = useState({
    Date_and_time_of_measurement: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];
    const currentDateTime = `${currentDate} ${currentTime}`;

    const newVitalWithDateTime = {
      ...newVital,
      Date_and_time_of_measurement: currentDateTime
    };
    // Here you can implement logic to add the new vital to the vitals list
    // For example, make an API call to add the new vital data
    console.log('New Vital:', newVital);
    setNewVital({
      Date_and_time_of_measurement: newVitalWithDateTime,
      Blood_pressure: '',
      Pulse: '',
      Body_temperature: '',
      Blood_sugar_level: '',
      Other_medical_parameters: ''
    });
  };

  return (
    <>
      <ObjectDetails title={"Patient Vitals"}>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 mt-10">
              <div>
                <label className={labelStyle}>Blood Pressure:</label>
                <input
                  type="text"
                  name="Blood_pressure"
                  value={newVital.Blood_pressure}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="Blood Pressure"
                />
              </div>
              <div>
                <label className={labelStyle}>Pulse:</label>
                <input
                  type="text"
                  name="Pulse"
                  value={newVital.Pulse}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="Pulse"
                />
              </div>
              <div>
                <label className={labelStyle}>Body Temperature:</label>
                <input
                  type="text"
                  name="Body_temperature"
                  value={newVital.Body_temperature}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="Body Temperature"
                />
              </div>
              <div>
                <label className={labelStyle}>Blood Sugar Level:</label>
                <input
                  type="text"
                  name="Blood_sugar_level"
                  value={newVital.Blood_sugar_level}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="Blood Sugar Level"
                />
              </div>
            </div>
            <div>
                <label className={labelStyle}>Other Parameters:</label>
                <input
                  type="text"
                  name="Other_medical_parameters"
                  value={newVital.Other_medical_parameters}
                  onChange={handleInputChange}
                  className={inputStyle}
                  placeholder="Other Medical Parameters"
                />
              </div>
            <button type="submit" className={bodyButton}>Save</button>
          </form>
      </ObjectDetails>
      <ObjectsListing objectsData={vitals} objectsTitle={"Vitals History"} key={"examination_id"}/>
    </>
  );
};

export default PatientVitals;
