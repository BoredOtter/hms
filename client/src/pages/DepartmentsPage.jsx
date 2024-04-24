import React from 'react'
import departments from '../../departments.json'
import ObjectsListing from '../components/listing/ObjectsListing';
import bodyButton from '../components/utils/bodyButton';
import { useState } from 'react';
import formLabel from '../components/utils/formLabel';
import formInput from '../components/utils/formInput';
import ObjectDetails from '../components/utils/ObjectDetails';
import DepartmentCreation from '../components/DepartmentCreation';

const departmentsData = departments.departments || [];

const DepartmentsPage = () => {
  const [creatingDepartment, setCreateDepartment] = useState(false);
  const handleCreateNewDepartment = () => {
    setCreateDepartment(!creatingDepartment);
  }
  
  return (
    <>
    <div className='flex justify-center mt-10'>
      <button className={bodyButton} onClick={handleCreateNewDepartment}> Create new Department</button>
    </div>
    {
      creatingDepartment && <DepartmentCreation/>
    }
    <ObjectsListing 
      objectsData={departmentsData} 
      objectsTitle={"Departments"}
      objectLink={"/departments"}
      objectKey={"id"}
      />
    </>
  )
}

export default DepartmentsPage;
