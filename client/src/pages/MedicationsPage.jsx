import React from 'react'
import { useState } from 'react';
import medications from '../../medications.json'
import SearchBar from '../components/SearchBar';
import ObjectsListing from '../components/listing/ObjectsListing';
import bodyButton from '../components/utils/bodyButton';
import MedicationCreation from '../components/MedicationCreation';

const MedicationsPage = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [searchById, setSearchById] = useState(false); 
    const [loading, setLoading] = useState(true);
    const [createMedication, setCreateMedication] = useState(false);

    const handleToggleSearch = () => {
        setSearchById(!searchById); // Toggle search by ID
    };

    const handleCreateMedication = () => {
        setCreateMedication(!createMedication);
    }

    const filteredMedications = medications.filter(medication => {
        const medicationValue = searchById ? medication.ID_medication.toString() : medication.Medication_name;
        const search = searchTerm.toLowerCase();

        return medicationValue.toLowerCase().includes(search);
    });
  return (


    <div className="container mx-auto px-4 py-8 text-center space-y-10">
        <button onClick={handleCreateMedication} className={bodyButton}> Add Medication</button>
        {
          createMedication && (<MedicationCreation/>)
        }
        <div className='grid grid-cols-2 gap-10'>
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
          <button onClick={handleToggleSearch} className={`${bodyButton} `}>Searching by {searchById ? 'ID' : 'Name'}</button>
        </div>
        <ObjectsListing
            objectsData={filteredMedications}
            objectsTitle={"Medications"}
            objectKey={"ID_medication"}
            objectLink={`/medications`}
        ></ObjectsListing>
    </div>
  )
}

export default MedicationsPage
