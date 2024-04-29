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
import RoomsCreation from '../components/creators/RoomsCreation';
import ResourceCreation from '../components/creators/ResourceCreation';
import OperationalRoomCreation from '../components/creators/OperationalCreationRoom';
import OperationRooms from '../components/OperationRooms';

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
  const handleShowOperationRooms = () => {
    setShowRooms(false);
    setShowResources(false);

  }

  const handleDeleteDepartment = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this department?");
      if (confirmDelete) {
      try {
        const response = await httpResources.delete(`/delete/department/${department.ID_department}`);
        alert("Department successfully deleted!");
        window.location.href = "/departments"

      } catch (error) {
        alert(error.response.data.detail);
      }
    } else {
      return;
    }
  };
  useEffect(() => {
    const findDepartment = async () => {
      try{
        const response = await httpResources.get(`get/department/id/${id}`)
        const foundDepartment = response.data;
          setDepartment(foundDepartment);
          setLoading(false);
      } catch(error){
        return Promise.reject(error);
      }
      
    }
    findDepartment()
  }, [id]);

  return (
    loading ? (<WarningInfo loading={true}/>) : (
      <>
      <div className='flex justify-center flex-grow grid grid-cols-1 md:grid-cols-2 gap-2'>      
      <div><RoomsCreation ID_department={department.ID_department}/></div>
      <OperationalRoomCreation ID_department={department.ID_department}/>
      <ResourceCreation ID_department={department.ID_department}/>
      <OperationRooms></OperationRooms>
      </div>
      
      <ObjectDetails title={"Department Details"}>
        <ObjectSlicer object={department}/>
          <div className='grid grid-cols-2 gap-2'>
            <button className={bodyButton} onClick={handleShowRooms}>Rooms</button>
            <button className={bodyButton} onClick={handleShowResources}>Resources</button>
            <button className={bodyButton} onClick={handleDeleteDepartment}>Delete</button>

            <NavLink
              to={'/departments/'}
              className={`${bodyButton}`}>
              Back
            </NavLink>
          </div>
        </ObjectDetails>
        { showResources && <div className='justify-center'><DepartmentResources ID_department={department.ID_department}/> </div>}
        { showRooms && <DepartmentRooms ID_department={department.ID_department}/> }
        {/* { showOperatingRooms && <>} */}
      </>
    )
  );
  
  
};

export default DepartmentPage;
