import React, { useState } from 'react';
import ObjectDetails from './utils/ObjectDetails';
import bodyButton from './utils/bodyButton';
import { NavLink } from 'react-router-dom';

const MedicationInfo = ({ medication }) => {
  const [editedMedication, setEditedMedication] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedMedication((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    console.log("Saved changes for medication:", editedMedication);
    setEditedMedication(null);
  };

  const handleCancelEdit = () => {
    setEditedMedication(null);
  };

  const handleDeleteMedication = () => {
    console.log(medication.ID_medication)
  }

  return (
    <ObjectDetails title={"Medication Information"}>
      <div className="pt-5">
        {Object.entries(medication).map(([key, value]) => (
          (key !== "ID_medication") && (
            <div key={key} className="text-l flex mb-2">
              <p className="font-bold mr-2">{key}:</p>
              {editedMedication && editedMedication['ID_medication'] === medication['ID_medication'] ? (
                <input
                  type="text"
                  name={key}
                  value={editedMedication[key]}
                  onChange={handleChange}
                  className="border-b border-gray-400 focus:outline-none focus:border-indigo-500 flex-grow"
                />
              ) : (
                <p>{typeof value === 'object' ? JSON.stringify(value) : value}</p>
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
                <button className={bodyButton} onClick={() => setEditedMedication(medication)}>Update</button>
                <button className={bodyButton} onClick={handleDeleteMedication}>Delete</button>
                <NavLink className={`${bodyButton} pt-3`} to={'/medications'}>Back</NavLink>
            </>
          )}
        </div>
      </div>
    </ObjectDetails>
  );
};

export default MedicationInfo;
