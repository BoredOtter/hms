import React, { useState } from 'react';
import patients from '../../patients.json';
import ObjectsListing from '../components/listing/ObjectsListing';
import SearchBar from '../components/SearchBar';

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const patientsData = patients.patients || [];

  const filteredPatients = patientsData.filter(patient => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const search = searchTerm.toLowerCase();

    return fullName.includes(search) || patient.first_name.toLowerCase().includes(search) || patient.last_name.toLowerCase().includes(search);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} /> {/* Use the SearchBar component */}
      <ObjectsListing 
        objectsData={filteredPatients} 
        objectsTitle={"Patients"}
        objectLink={"/patients"}
      />
    </div>
  )
}

export default PatientsPage;
