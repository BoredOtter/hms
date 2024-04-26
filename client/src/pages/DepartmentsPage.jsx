import React from 'react'
import ObjectsListing from '../components/listing/ObjectsListing';
import bodyButton from '../components/utils/bodyButton';
import { useState, useEffect } from 'react';
import DepartmentCreation from '../components/DepartmentCreation';
import httpResources from '../client/httpResources';
import WarningInfo from './WarningInfo';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true);
  const [creatingDepartment, setCreateDepartment] = useState(false);
  const handleCreateNewDepartment = () => {
    setCreateDepartment(!creatingDepartment);
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      try{
        const response = await httpResources.get("/get/department/all");
        const foundDepartments = response.data;
        if(foundDepartments){
          setDepartments(foundDepartments);
          setLoading(false);
        }
      } catch(error){
        <WarningInfo info={"Failed to fetch departments!"}/>
      }
    }

    fetchDepartments();
  }, [])
  
  return (
    <>
      {loading ? (
        <WarningInfo loading={true} />
      ) : (
        <>
          <div className='flex justify-center mt-10'>
            <button className={bodyButton} onClick={handleCreateNewDepartment}> Create new Department</button>
          </div>
          {creatingDepartment && <DepartmentCreation />}
          <ObjectsListing 
            objectsData={departments} 
            objectsTitle={"Departments"}
            objectLink={"/departments"}
            objectKey={"ID_department"}
          />
        </>
      )}
    </>
  );
  
}

export default DepartmentsPage;
