import React from 'react';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import loggedUser from '../../auth/loggedUser';


const NavbarRoles = () => {
  const employee = loggedUser();
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 768); 
    useEffect(() => {
      const handleResize = () => {
          setIsWideScreen(window.innerWidth > 768); 
      };
      window.addEventListener('resize', handleResize); 
      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, []);


  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  const logoutClass = () =>
    'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  return (
    <div className={isWideScreen ? "flex justify-between items-center text-center" : "grid grid-cols-4 text-center items-center gap-2 mb-1"}>  
      <NavLink to='/patients' className={linkClass}>Patients</NavLink>
      <NavLink to='/medications' className={linkClass}>Medications</NavLink>
      {employee.roles.includes('admin') && (
        <>
          <NavLink to='/operating_rooms' className={linkClass}>Operating rooms</NavLink>
          <NavLink to='/departments' className={linkClass}>Departments</NavLink>  
          <NavLink to='/employees' className={linkClass}>Employees</NavLink>
          <NavLink to='/procedures' className={linkClass}>Procedures</NavLink>
          <NavLink to='/register' className={linkClass}>Register</NavLink>
          <NavLink to='/rooms' className={linkClass}>Rooms</NavLink>
        </>
      )}

      {(employee.roles.includes('nurse')) && (
        <>
          <NavLink to='/employee-schedules' className={linkClass}>Schedules</NavLink>
          <NavLink to='/register' className={linkClass}>Register</NavLink>
          <NavLink to='/rooms' className={linkClass}>Rooms</NavLink>
        </>
      )}
      {
        employee.roles.includes('doctor') && (
          <>
          <NavLink to='/register' className={linkClass}>Register</NavLink>
          <NavLink to='/employee-procedures' className={linkClass}>Procedures</NavLink>
          <NavLink to='/employee-schedules' className={linkClass}>Schedules</NavLink>
          <NavLink to='/rooms' className={linkClass}>Rooms</NavLink>
          </>
        )
      }

    </div>
  );
};

export default NavbarRoles;

