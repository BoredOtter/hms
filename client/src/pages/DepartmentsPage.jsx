import React from 'react'
import departments from '../../departments.json'
import ObjectsListing from '../components/listing/ObjectsListing';

const DepartmentsPage = () => {

  const departmentsData = departments.departments || [];
  return (
    <ObjectsListing 
      objectsData={departmentsData} 
      objectsTitle={"Departments"}
      objectLink="/departments"
      />
  )
}

export default DepartmentsPage;
