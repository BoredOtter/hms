import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DepartmentResources from '../components/DepartmentResources';
import DepartmentRooms from '../components/DepartmentRooms';
import bodyButton from '../components/utils/bodyButton';
import { NavLink } from 'react-router-dom';
import httpResources from '../client/httpResources';
import RoomsCreation from '../components/creators/RoomsCreation';
import ResourceCreation from '../components/creators/ResourceCreation';
import OperationalRoomCreation from '../components/creators/OperationalCreationRoom';
import DepartmentInfo from '../components/DepartmentInfo';
import EmployeeCreation from '../components/creators/EmployeeCreation';

const DepartmentPage = () => {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState("info");

  const handleSetActiveSection = (section) => {
    setActiveSection(section);
  };

  const handleDeleteDepartment = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this department?");
    if (confirmDelete) {
      try {
        await httpResources.delete(`/delete/department/${id}`);
        alert("Department successfully deleted!");
        window.location.href = "/departments";
      } catch (error) {
        alert(error.response.data.detail);
      }
    }
  };

  return (
    <>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2'>
        <button className={bodyButton} onClick={() => handleSetActiveSection("rooms")}>Rooms</button>
        <button className={bodyButton} onClick={() => handleSetActiveSection("resources")}>Resources</button>
        <button className={bodyButton} onClick={() => handleSetActiveSection("info")}>Info</button>
        <NavLink to={'/departments/'} className={bodyButton}>Back</NavLink>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2'>
        <button className={bodyButton} onClick={() => handleSetActiveSection("addRooms")}>Add Rooms</button>
        <button className={bodyButton} onClick={() => handleSetActiveSection("addResources")}>Add Resources</button>
        <button className={bodyButton} onClick={() => handleSetActiveSection("addEmployee")}>Add Employee</button>
        <button className={bodyButton} onClick={handleDeleteDepartment}>Delete department</button>
      </div>

      {activeSection === "resources" && <DepartmentResources ID_department={id} />}
      {activeSection === "rooms" && <DepartmentRooms ID_department={id} />}
      {activeSection === "addResources" && <ResourceCreation ID_department={id} />}
      {activeSection === "info" && <DepartmentInfo ID_department={id} />}
      {activeSection === "addRooms" &&
        <>
          <RoomsCreation ID_department={id} />
          <OperationalRoomCreation ID_department={id} />
        </>
      }
      {activeSection === "addEmployee" && <EmployeeCreation ID_department={id} />}
    </>
  )
};


export default DepartmentPage;
