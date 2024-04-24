import React, { useState, useEffect } from 'react';
// import patients from '../../patients.json';
import ObjectsListing from '../components/listing/ObjectsListing';
import SearchBar from '../components/SearchBar';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch('https://hms.test/api/v1/patients/getall/db')
      .then(response => response.json())
      .then(data => setPatients(data.collection));
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const search = searchTerm.toLowerCase();

    return fullName.includes(search) || patient.first_name.toLowerCase().includes(search) || patient.last_name.toLowerCase().includes(search);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      <ObjectsListing 
        objectsData={filteredPatients} 
        objectsTitle={"Patients"}
        objectLink={"/patients"}
        objectKey={"PESEL"}
      />
    </div>
  )
}

export default PatientsPage;
