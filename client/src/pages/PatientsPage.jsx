import React from 'react'
import patients from '../../patients.json'
import ObjectsListing from '../components/listing/ObjectsListing';

const PatientsPage = () => {
  const patientsData = patients.patients || [];

  return (
    <ObjectsListing 
      objectsData={patientsData} 
      objectsTitle={"Patients"}
      objectLink={"/patients"}
      display={["firstname", "lastname"]}
      />
  )
}

export default PatientsPage
