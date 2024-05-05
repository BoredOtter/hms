import React from 'react'
import { useState, useEffect } from 'react';
import httpPatients from '../client/httpPatients';
import ObjectDetails from '../components/utils/ObjectDetails';
import formInput from '../components/utils/formInput';
import formLabel from '../components/utils/formLabel';
import bodyButton from '../components/utils/bodyButton';
import ObjectSlicer from '../components/utils/ObjectSlicer';
import WarningInfo from '../pages/WarningInfo';
import httpResources from '../client/httpResources';
import PatientBedReservationCreation from './creators/PatientBedReservationCreation';
import { NavLink } from 'react-router-dom';

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
    const [bedReservation, setBedReservation] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [patient, setPatient] = useState('');
    const [refreshing, setRefreshing] = useState(false);


  const refresh = () => {
    setRefreshing(!refreshing);
  }

  useEffect(() => {
    const fetchPatient = async () => {
        try {
            const response = await httpPatients.get(`/get/${patient_id}`);
            const foundPatient = response.data;
            setPatient(foundPatient);
            setEditedPatient(foundPatient);
        } catch (error) {
          alert(error.response.data.detail)
        } finally {
          setLoading(false);
        }
    };
    fetchPatient();
}, [submitted]);

  useEffect(() => {
    const fetchBedReservation = async () => {
      try{
        const bedReservation = await httpResources.get(`/get/bed_reservation`, {params: {patient_id: patient_id}})
        const foundBedReservations = bedReservation.data;
        setBedReservation(foundBedReservations[0]);
      } catch(error){}
    }
    fetchBedReservation();
  }, [refreshing])

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedPatient({ ...editedPatient, [name]: value });
  };

  const handleIsEditing = () => {
    setIsEditing(!isEditing);
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
  
    const changedFields = {};
    for (const key in patient) {
        if (patient[key] !== editedPatient[key]) {
            changedFields[key] = editedPatient[key];
        }
    }

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
        {
          bedReservation? (
            <div className="flex flex-col justify-center items-center">
              <ObjectDetails title={"Bed Reservation"}>
                <ObjectSlicer object={bedReservation}></ObjectSlicer>
                <NavLink to={`/rooms/${bedReservation.ID_room}` }className={`${bodyButton} pt-3`}>Check Room</NavLink>
              </ObjectDetails>
            </div>
          ) : <PatientBedReservationCreation patient_id={patient_id} refresh={refresh}></PatientBedReservationCreation>
        }
      </div>
    ) : <WarningInfo loading={true}/>
  );
  
  
};

export default PatientInfo;
