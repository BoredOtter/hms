import React from 'react'
import departments from '../../departments.json'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import WarningInfo from './WarningInfo';
import DepartmentResources from '../components/DepartmentResources';
import rooms from '../../rooms.json'
import resources from '../../resources.json'
import DepartmentRooms from '../components/DepartmentRooms';
import ObjectDetails from '../components/utils/ObjectDetails';
import ObjectSlicer from '../components/utils/ObjectSlicer';
import bodyButton from '../components/utils/bodyButton';
import { NavLink } from 'react-router-dom';

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
    const foundDepartment = departments.departments.find(dep => dep.id === id);
    if (foundDepartment) {
      setDepartment(foundDepartment);
      setLoading(false);
    }
  }, [id]);

  return (
    loading ? <WarningInfo loading={true}/> : (
      <>
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
      </>
    )
  );
  
  
};

export default DepartmentPage;
