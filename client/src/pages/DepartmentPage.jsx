import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import WarningInfo from './WarningInfo';
import DepartmentResources from '../components/DepartmentResources';
import DepartmentRooms from '../components/DepartmentRooms';
import ObjectDetails from '../components/utils/ObjectDetails';
import ObjectSlicer from '../components/utils/ObjectSlicer';
import bodyButton from '../components/utils/bodyButton';
import { NavLink } from 'react-router-dom';
import httpResources from '../client/httpResources';

const DepartmentPage = () => {

  const {id} = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRooms, setShowRooms] = useState(false);
  const [showResources, setShowResources] = useState(false);

  const handleShowRooms = () => {
    setShowRooms(!showRooms);
    setShowResources(false);
  }

  const handleShowResources = () => {
    setShowRooms(false);
    setShowResources(!showResources);
  }
  useEffect(() => {
    const findDepartment = async () => {
      try{
        const response = await httpResources.get(`get/department/id/${id}`)
        const foundDepartment = response.data;
        if(foundDepartment){
          setDepartment(foundDepartment);
          setLoading(false);
        }
      } catch(error){
        alert(error.response.data.details);
        return Promise.reject(error);
      }
      
    }
    findDepartment()
  }, [id]);

  return (
    loading ? <WarningInfo loading={true}/> : (
      <div className='flex justify-center'>
        <ObjectDetails title={"Department Details"}>
          <ObjectSlicer object={department}/>
          <div className='button space-x-2 text-center'>
            <button className={bodyButton} onClick={handleShowRooms}>Rooms</button>
            <button className={bodyButton} onClick={handleShowResources}>Resources</button>
            <NavLink
              to={'/departments/'}
              className={`${bodyButton} pt-3`}>
              Back
            </NavLink>
          </div>
        </ObjectDetails>
        { showResources && <DepartmentResources resources={resources}/> }
        { showRooms && <DepartmentRooms rooms={rooms}/> }
      </div>
    )
  );
  
  
};

export default DepartmentPage;
