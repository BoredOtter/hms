import React from 'react'
import formInput from './utils/formInput'
import formLabel from './utils/formLabel'
import bodyButton from './utils/bodyButton'
import { useState } from 'react'
import ObjectDetails from './utils/ObjectDetails'

const PatientInfo = ({patient}) => {
    const [editedPatient, setEditedPatient] = useState(patient);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPatient({ ...editedPatient, [name]: value });
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can implement logic to update the patient's details
    // For example, make an API call to update the patient's information
    // After successful update, you can set editing to false
    setEditing(false);
    };

  return (
    <ObjectDetails title={"Change patient informations"}>
    <form onSubmit={handleSubmit} className="space-y-4">
            <div className='space-y-4'>
              <label className={formLabel}>
                First Name:
                <input
                  type="text"
                  name="First_name"
                  value={editedPatient.First_name}
                  onChange={handleInputChange}
                  className={formInput}
                />
              </label>
              <label className={formLabel}>
                Last Name:
                <input
                  type="text"
                  name="Last_name"
                  value={editedPatient.Last_name}
                  onChange={handleInputChange}
                  className={formInput}
                />
              </label>
              <label className={formLabel}>
                Date of Birth:
                <input
                  type="text"
                  name="Date_of_birth"
                  value={editedPatient.Date_of_birth}
                  onChange={handleInputChange}
                  className={formInput}
                  pattern="\d{4}-\d{2}-\d{2}"
                  placeholder="YYYY-MM-DD"
                  title="Date should be in the format YYYY-MM-DD"
                />
              </label>
              <label className={formLabel}>
                Gender:
                <input
                  type="text"
                  name="Gender"
                  value={editedPatient.Gender}
                  onChange={handleInputChange}
                  className={formInput}
                />
              </label>
              <label className={formLabel}>
                Contact Number:
                <input
                  type="text"
                  name="Contact_number"
                  value={editedPatient.Contact_number}
                  onChange={handleInputChange}
                  className={formInput}
                />
              </label>
              <label className={formLabel}>
                Address:
                <input
                  type="text"
                  name="Address"
                  value={editedPatient.Address}
                  onChange={handleInputChange}
                  className={formInput}
                />
              </label>
              <label className={formLabel}>
                PESEL:
                <input
                  type="text"
                  name="PESEL"
                  value={editedPatient.PESEL}
                  onChange={handleInputChange}
                  className={formInput}
                />
              </label>
            </div>
            <div className="flex justify-center space-x-4">
              <button type="submit" className={bodyButton}>Save</button>
            </div>
          </form>
        </ObjectDetails>
  )
}

export default PatientInfo
