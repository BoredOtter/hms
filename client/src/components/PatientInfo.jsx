import React from 'react'
import { useState, useEffect } from 'react';
import httpPatients from '../client/httpPatients';
import ObjectDetails from '../components/utils/ObjectDetails';
import formInput from '../components/utils/formInput';
import formLabel from '../components/utils/formLabel';
import bodyButton from '../components/utils/bodyButton';
import ObjectSlicer from '../components/utils/ObjectSlicer';
import WarningInfo from '../pages/WarningInfo';

const formatPhoneNumber = (phoneNumber) => {
    // Remove all non-numeric characters from the input
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    // Apply the pattern "xxx-xxx-xxx"
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})$/);
    if (match) {
        return [match[1], match[2], match[3]].filter((group) => group.length > 0).join('-');
    }
    return cleaned.slice(0, 9); // Ensure only 9 digits are displayed
}

const PatientInfo = ({patient_id}) => {
    const [loading, setLoading] = useState(true);
    const [editedPatient, setEditedPatient] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [patient, setPatient] = useState('')

  useEffect(() => {
    const fetchPatient = async () => {
        try {
            const response = await httpPatients.get(`/get/${patient_id}`);
            const foundPatient = response.data;
            if (foundPatient) {
                setPatient(foundPatient);
                setEditedPatient(foundPatient);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching patient:', error);
            // Handle error here
        }
    };
    fetchPatient();
}, [submitted]);

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedPatient({ ...editedPatient, [name]: value });
  };

  const handleIsEditing = () => {
    setIsEditing(!isEditing);
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
  
    // Compare editedPatient with the original patient object to find the changes
    const changedFields = {};
    for (const key in patient) {
        if (patient[key] !== editedPatient[key]) {
            // Add the key-value pair to the changedFields object
            changedFields[key] = editedPatient[key];
        }
    }

    // Check if any fields have been edited
    if (Object.keys(changedFields).length === 0) {
      alert("No changes were made!")
      return;
    }

    try {
      await httpPatients.patch(`/update/${patient_id}`, changedFields);
      setSubmitted(!submitted)
      setIsEditing(!isEditing)
      alert("Updated successfully!")
    } catch (error) {
        console.error('Error updating patient:', error);
    }
  };
  return (
    !loading ? (
      <div className="flex flex-col justify-center items-center">
        <ObjectDetails title={"Patient Information"}>
          <ObjectSlicer object={patient}></ObjectSlicer>
          <button className={bodyButton} onClick={handleIsEditing}>Change informations</button>
          {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <label className={formLabel}>
                Contact Number:
                <input
                  type="text"
                  name="Contact_number"
                  value={formatPhoneNumber(editedPatient.Contact_number)}
                  onChange={handleInputChange}
                  className={formInput}
                  maxLength={11}
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
            </div>
            <div className="flex justify-center space-x-4">
              <button type="submit" className={bodyButton}>Save</button>
            </div>
          </form>
          ) : null}
        </ObjectDetails>
      </div>
    ) : <WarningInfo loading={true}/>
  );
  
  
};

export default PatientInfo;
