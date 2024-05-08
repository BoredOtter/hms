import React from 'react'
import ObjectsListing from '../components/listing/ObjectsListing';
import bodyButton from '../components/utils/bodyButton';
import { useState, useEffect } from 'react';
import DepartmentCreation from '../components/creators/DepartmentCreation';
import httpResources from '../client/httpResources';
import WarningInfo from './WarningInfo';
import loggedUser from '../auth/loggedUser';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const employee = loggedUser();

  const refresh = () => {
    setRefreshing(!refreshing);
  }

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await httpResources.get("/get/department/all");
        const foundDepartments = response.data;
        setDepartments(foundDepartments);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setDepartments([]);
          setLoading(false);
        } else {
          <WarningInfo info={"Failed to fetch departments!"}/>
        }
      }
    };
  
    fetchDepartments();
  }, [refreshing]);
  
  return (
    <>
      {loading ? (
        <WarningInfo loading={true}/>
      ) : (
        <>
          {employee.roles.includes('admin') && <DepartmentCreation refresh={refresh}/> }
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
