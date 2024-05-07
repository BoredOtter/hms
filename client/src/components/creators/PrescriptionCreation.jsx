import React, { useState, useEffect } from 'react';
import ObjectDetails from '../utils/ObjectDetails';
import httpPharmacy from '../../client/httpPharmacy';
import formInput from '../utils/formInput';
import bodyButton from '../utils/bodyButton';
import SearchBar from '../SearchBar';
import loggedUser from '../../auth/loggedUser';

const PrescriptionCreation = ({patient_id}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allMedications, setAllMedications] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const employee = loggedUser();

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

  const handleChange = (index, field, value) => {
    const updatedMedications = [...selectedMedications];
    updatedMedications[index][field] = value;
    setSelectedMedications(updatedMedications);
  };

  const handleSavePrescription = async () => {
    const hasEmptyFields = selectedMedications.some(medication => medication.dosage.trim() === '' || medication.quantity.trim() === '');
    if (hasEmptyFields) {
      alert("Please fill in all fields for selected medications.");
      return;
    }

    try {
      const prescription = {
        Prescription_data: {
          ID_patient: patient_id,
          ID_doctor: employee.uuid
        },
        Medication_list: selectedMedications.map(medication => ({
          ID_medication: medication.ID_medication,
          Dosage: medication.dosage,
          Quantity: medication.quantity
        }))
      };
      await httpPharmacy.post("/add/prescription", prescription);
      setSelectedMedications([]);
      setSearchTerm('');
      alert("Prescription added successfully!");
    } catch (error) {
      console.error("Error saving prescription:", error);
    }
  };

  return (
    <ObjectDetails title={"Create new Prescription"}>
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      {searchTerm !== '' && 
        <div>
          {filteredMedications.map(medication => (
            <ObjectDetails key={medication.ID_medication} title={medication.Medication_name}>
              <button onClick={() => handleAddMedication(medication)} className={bodyButton}>Add</button>
            </ObjectDetails>
          ))}
        </div>
      }
      <div className='mt-5'>
        <h3>Selected Medications:</h3>
        {selectedMedications.map((medication, index) => (
          <div key={index} className="space-y-2">
            <span className='font-bold' style={{color: 'black'}}>{medication.Medication_name}</span>
            <input
              type="text"
              placeholder="Dosage"
              value={medication.dosage}
              onChange={e => handleChange(index, 'dosage', e.target.value)}
              className={formInput}
            />
            <input
              type="text"
              placeholder="Quantity"
              value={medication.quantity}
              onChange={e => handleChange(index, 'quantity', e.target.value)}
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
