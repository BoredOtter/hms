import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import httpPharmacy from '../client/httpPharmacy';
import WarningInfo from './WarningInfo';
import formInput from '../components/utils/formInput';
import ObjectDetails from '../components/utils/ObjectDetails';
import bodyButton from '../components/utils/bodyButton';
import loggedUser from '../auth/loggedUser';

const MedicationPage = () => {
  const { id } = useParams();
  const [medication, setMedication] = useState(null);
  const [editedMedication, setEditedMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const employee= loggedUser();

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await httpPharmacy.get(`get/medicationID/${id}`);
        const foundMedications = response.data;
        if (foundMedications) {
          setMedication(foundMedications);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch medications:", error);
        setLoading(false);
      }
    };

    fetchMedications();
  }, [id]); // Add id to the dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    // Check if the field being updated is "Price"
    if (name === 'Price') {
        // Ensure the input value is a valid number or empty string
        const match = value.match(/^(-?\d*\.?\d{0,2}).*$/);
        parsedValue = match ? match[1] : '';
    }

    setEditedMedication(prevState => ({
        ...prevState,
        [name]: parsedValue
    }));
};

  const handleSaveChanges = async () => {
    try {
      const updatedFields = {};
      for (const key in editedMedication) {
        if (editedMedication[key] !== medication[key]) {
          updatedFields[key] = editedMedication[key];
        }
      }
      await httpPharmacy.patch(`update/medication/${editedMedication.ID_medication}`, updatedFields);

      // Clear the updated fields but keep other fields intact
      for (const key in updatedFields) {
        medication[key] = editedMedication[key];
      }

      setEditedMedication(null);
      alert("Updated successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditedMedication(null);
  };

  return (
    !loading ? (
      <div className='flex justify-center'>
      <ObjectDetails title={"Medication Information"}>
          {Object.entries(medication).map(([key, value]) => (
            (key !== "ID_medication") && (
              <div key={key} className="grid grid-cols-2 text-center my-2">
                <p className="font-bold mr-2 flex items-center justify-start">{key}:</p> {/* Apply justify-start to align text to the left */}
                {editedMedication && editedMedication['ID_medication'] === medication['ID_medication'] ? (
                  <input
                    type="text"
                    name={key}
                    value={editedMedication[key]}
                    onChange={handleChange}
                    className={`${formInput} flex items-center justify-center`}
                  />
                ) : (
                  <p className="flex items-center justify-start">{typeof value === 'object' ? JSON.stringify(value) : value}</p>
                )}
              </div>
            )
          ))}
          <div className="mt-2 md:mt-0 space-x-2 space-y-2">
            {editedMedication && editedMedication['ID_medication'] === medication['ID_medication'] ? (
              <>
                <button className={bodyButton} onClick={handleSaveChanges}>Save Changes</button>
                <button className={bodyButton} onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {employee.roles.includes('admin') && <button className={bodyButton} onClick={() => setEditedMedication(medication)}>Update</button>}
                <NavLink className={`${bodyButton} pt-3`} to={'/medications'}>Back</NavLink>
              </>
            )}
          </div>
      </ObjectDetails>
      </div>
    ) : <WarningInfo loading={true} />
  );
}

export default MedicationPage;
