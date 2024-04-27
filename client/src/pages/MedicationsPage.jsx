import React from 'react'
import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ObjectsListing from '../components/listing/ObjectsListing';
import bodyButton from '../components/utils/bodyButton';
import MedicationCreation from '../components/creators/MedicationCreation';
import httpPharmacy from '../client/httpPharmacy';
import { useEffect } from 'react';
import WarningInfo from './WarningInfo';

const MedicationsPage = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [searchById, setSearchById] = useState(false); 
    const [loading, setLoading] = useState(true);
    const [medications, setMedications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const refresh = () => {
      setRefreshing(!refreshing);
    }

    useEffect (() => {
      const fetchMedications = async () => {
        const response = await httpPharmacy.get("get/medications");
        const foundMedications = response.data;
        if(foundMedications){
          setMedications(foundMedications);
          setLoading(false);
        }
      }

      fetchMedications();
    }, [refreshing])

    const handleToggleSearch = () => {
        setSearchById(!searchById); // Toggle search by ID
    };

    const filteredMedications = medications.filter(medication => {
        const medicationValue = searchById ? medication.ID_medication.toString() : medication.Medication_name;
        const search = searchTerm.toLowerCase();

        return medicationValue.toLowerCase().includes(search);
    });
  return (
    loading ? <WarningInfo loading={true}/> 
    :
    <div className="container mx-auto px-4 py-8 justify-center items-center text-center space-y-10">
        <div className="flex justify-center"><MedicationCreation refresh={refresh}/></div>
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
