import React, { useState, useEffect } from 'react';
import ObjectsListing from '../components/listing/ObjectsListing';
import SearchBar from '../components/SearchBar';
import httpPatients from '../client/httpPatients';
import WarningInfo from './WarningInfo';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await httpPatients.get("/getall/db");
            setPatients(response.data);
            setLoading(false);
        } catch (error) {
           <WarningInfo info={"Cannot fetch patients Data"}/>
        }
    };
    fetchData();
    return () => {
};
}, []);
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.First_name} ${patient.Last_name}`.toLowerCase();
    const search = searchTerm.toLowerCase();

    return fullName.includes(search) || patient.First_name.toLowerCase().includes(search) || patient.Last_name.toLowerCase().includes(search) || patient.PESEL.includes(search);
  });

  return (
    loading ? <WarningInfo loading={true}/>
    :<div className="mt-8">
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      <ObjectsListing 
        objectsData={filteredPatients} 
        objectsTitle={"Patients"}
        objectLink={"/patients"}
        objectKey={"Patient_uuid"}
      />
    </div>
     
  )
}

export default PatientsPage;
