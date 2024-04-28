import React, { useState, useEffect } from 'react';
import ObjectDetails from '../utils/ObjectDetails';
import httpPharmacy from '../../client/httpPharmacy';
import formInput from '../utils/formInput';
import bodyButton from '../utils/bodyButton';
import SearchBar from '../SearchBar';

const PrescriptionCreation = ({ refresh, ID_patient, ID_doctor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allMedications, setAllMedications] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await httpPharmacy.get("/get/medications");
        setAllMedications(response.data);
      } catch (error) {
        alert(error.response.data.detail);
      }
    };
    fetchMedications();
  }, []);

  const filteredMedications = allMedications.filter(medication => {
    const medicationValue = medication.Medication_name;
    const search = searchTerm.toLowerCase();

    return medicationValue.toLowerCase().includes(search);
  });

  const handleAddMedication = (medication) => {
    // Check if the medication is already in the selected list
    if (!selectedMedications.find(med => med.ID_medication === medication.ID_medication)) {
      setSelectedMedications([...selectedMedications, { ...medication, dosage: '', quantity: '' }]);
    } else {
      alert("Medication is already added.");
    }
  };

  const handleDeleteMedication = (index) => {
    const updatedMedications = [...selectedMedications];
    updatedMedications.splice(index, 1);
    setSelectedMedications(updatedMedications);
  };

  const handleDosageChange = (index, value) => {
    const updatedMedications = [...selectedMedications];
    updatedMedications[index].dosage = value;
    setSelectedMedications(updatedMedications);
  };

  const handleQuantityChange = (index, value) => {
    const updatedMedications = [...selectedMedications];
    updatedMedications[index].quantity = value;
    setSelectedMedications(updatedMedications);
  };

  const handleSavePrescription = async () => {
    try {
      // Constructing prescription data object
      const prescriptionData = {
        ID_patient: ID_patient,
        ID_doctor: '986d7c71-a3ab-4ffa-86a9-ab1d3d8c8c29'
      };
  
      // Constructing medication list array
      const medicationList = selectedMedications.map(medication => ({
        ID_medication: medication.ID_medication,
        Quantity: medication.quantity,
        Dosage: medication.dosage
      }));
  
      // Constructing the payload for the POST request
      const payload = {
        Prescription_data: prescriptionData,
        Medication_list: medicationList
      };
  
      // Assuming you have a function to save the prescription
      // const response = await savePrescriptionFunction(payload);
  
      httpPharmacy.post("/add/prescription", payload)
      console.log(payload)
      alert("Prescription added!")
      refresh();
    } catch (error) {
      console.error("Error saving prescription:", error);
    }
  };

  return (
    <ObjectDetails title={"Create new Prescription"}>
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      {searchTerm !== '' && (
        <div>
          {filteredMedications.map(medication => (
            <ObjectDetails key={medication.ID_medication} title={medication.Medication_name}>
              <button onClick={() => handleAddMedication(medication)} className={bodyButton}>Add</button>
            </ObjectDetails>
          ))}
        </div>
      )}
      <div className='mt-5'>
        <h3>Selected Medications:</h3>
        {selectedMedications.map((medication, index) => (
          <div key={index} className="space-y-2">
            <span className='font-bold' style={{color: 'black'}}>{medication.Medication_name}</span>
            <input
              type="text"
              placeholder="Dosage"
              value={medication.dosage}
              onChange={e => handleDosageChange(index, e.target.value)}
              className={formInput}
            />
            <input
              type="text"
              placeholder="Quantity"
              value={medication.quantity}
              onChange={e => handleQuantityChange(index, e.target.value)}
              className={formInput}
              inputMode={'numeric'}
            />
            <button onClick={() => handleDeleteMedication(index)} className={bodyButton}>Delete</button>
          </div>
        ))}
      </div>
      <div>
        <button className={`${bodyButton} mt-2`} onClick={handleSavePrescription}>Save Prescription</button>
      </div>
    </ObjectDetails>
  );
};

export default PrescriptionCreation;
