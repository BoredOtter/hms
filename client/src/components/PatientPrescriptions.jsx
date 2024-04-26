import React, { useState } from 'react';
import bodyButton from './utils/bodyButton';
import ObjectDetails from './utils/ObjectDetails';
import formInput from './utils/formInput';
import formLabel from './utils/formLabel';

const PatientPrescriptions = ({ patient_id }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedMedications, setEditedMedications] = useState(() => prescriptions.Medication_list.map(() => ({})));
  
  const handleEditMedication = (index) => {
    setEditedMedications((prevEditedMedications) => {
      const newEditedMedications = [...prevEditedMedications];
      if (!newEditedMedications.includes(index)) {
        newEditedMedications[index] = { ...prescriptions.Medication_list[index] };
      }
      return newEditedMedications;
    });
    setEditMode(true);
  };
  const handleDeleteMedication = (index) => {
    console.log("DELETE ENDPOINT")
  }

  const handleChange = (event, index, key) => {
    const { value } = event.target;
    setEditedMedications((prevEditedMedications) => {
      const updatedMedications = [...prevEditedMedications];
      updatedMedications[index] = {
        ...updatedMedications[index],
        [key]: value,
      };
      return updatedMedications;
    });
  };

  const handleSaveChanges = () => {
    console.log("Updated Medication List:", editedMedications);
    setEditedMedications([]);
    setEditMode(false);
  };

  const handleCancelEdit = (index) => {
    setEditedMedications((prevEditedMedications) => {
      const updatedMedications = [...prevEditedMedications];
      updatedMedications[index] = {};
      return updatedMedications;
    });
    setEditMode(false);
  };

  const [medication, setMedication] = useState({
    ID_medication: 0,
    Quantity: 0,
    Dosage: "string"
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMedication({ ...medication, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted Medication Data:", medication);
    // Add your logic to send the medication data to the server here
  };

  return (
    <>
    <ObjectDetails title={"Add prescription"}>
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-4 mt-10">
        <div>
          <label className={formLabel}>Medication ID:</label>
          <input
            type="text"
            name="ID_medication"
            onChange={handleInputChange}
            className={formInput}
            placeholder="Medication ID"
          />
        </div>
        <div>
          <label className={formLabel}>Quantity:</label>
          <input
            type="text"
            name="Quantity"
            onChange={handleInputChange}
            className={formInput}
            placeholder="Quantity"
          />
        </div>
        <div>
          <label className={formLabel}>Dosage:</label>
          <input
            type="text"
            name="Dosage"
            onChange={handleInputChange}
            className={formInput}
            placeholder="Dosage"
          />
        </div>
      </div>
      <button type="submit" className={bodyButton}>Save</button>
    </form>
    </ObjectDetails>
    <div className="container-xl lg:container m-auto bg-sky-100 rounded-xl p-3.5 hover:bg-sky shadow-md relative mb-10">
      {/* Prescription Data */}
      <div className="font-bold text-l flex mb-2">
        <p className="font-bold mr-2">Prescription Data (Doctor ID):</p>
        <p>{prescriptions.Prescription_data.ID_doctor}</p> {/* Display only the doctor ID */}
      </div>
      <h2 className="font-bold text-l mb-2">Medication List:</h2>
      <div className='grid grid-cols-2 gap-4'>
        {prescriptions.Medication_list.map((medication, index) => (
          <div key={index} className="bg-gray-200 rounded-xl p-3.5 hover:bg-sky shadow-md hover:shadow-lg relative mb-2">
            {Object.entries(medication).map(([key, value]) => (
              <div key={key} className="font-bold text-l flex mb-2">
                <p className="font-bold mr-2">{key}:</p>
                {editedMedications[index] && editedMedications[index][key] !== undefined ? (
                  <input 
                    type="text" 
                    name={key} 
                    value={editedMedications[index][key]} 
                    onChange={(event) => handleChange(event, index, key)} 
                    className="border-b border-gray-400 focus:outline-none focus:border-indigo-500 flex-grow"
                  />
                ) : (
                  <p>{value}</p>
                )}
              </div>
            ))}
            {/* Edit Button */}
            {(!editedMedications[index] || Object.keys(editedMedications[index]).length === 0) && (
              <div className="flex gap-2 mt-2">
                <button className={bodyButton} onClick={() => handleEditMedication(index)}>Edit</button>
                <button className={bodyButton} onClick={() => handleDeleteMedication(index)}>Delete</button>
              </div>
            )}
            {/* Save and Cancel Buttons */}
            {editedMedications[index] && Object.keys(editedMedications[index]).length > 0 && (
              <div className="flex gap-2 mt-2">
                <button className={bodyButton} onClick={handleSaveChanges}>Save</button>
                <button className={bodyButton} onClick={() => handleCancelEdit(index)}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default PatientPrescriptions;
