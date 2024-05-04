import React from 'react';
import { NavLink } from 'react-router-dom';
import keycloak from '../../auth/keycloak';
import { useEffect, useState } from 'react';


// const CURRENT_USER_TYPE = "doctor";

const handleLogout = () => {
      
  keycloak.logout();
 
};

const NavbarRoles = ({ loggedUser }) => {
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 768); // Assuming 768px as the breakpoint  useEffect(() => {
    useEffect(() => {
      const handleResize = () => {
          setIsWideScreen(window.innerWidth > 768); // Update state based on window width
      };

      window.addEventListener('resize', handleResize); // Add event listener for window resize

      return () => {
          window.removeEventListener('resize', handleResize); // Remove event listener on component unmount
      };
  }, []);


  const CURRENT_USER_TYPE = loggedUser;
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  const logoutClass = () =>
    'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  return (
    <div className={isWideScreen ? "flex justify-between items-center" : "grid grid-cols-2 text-center gap-2 mb-1"}>  
    <NavLink to='/departments' className={linkClass}>Departments</NavLink>   
      <NavLink to='/register' className={linkClass}>Register</NavLink>
      <NavLink to='/patients' className={linkClass}>Patients</NavLink>
      <NavLink to='/medications' className={linkClass}>Medications</NavLink>
      <NavLink to='/operating_rooms' className={linkClass}>Operating Rooms</NavLink>
      <NavLink to='/schedule' className={linkClass}>Schedule</NavLink>
      <NavLink to='/employees' className={linkClass}>Employees</NavLink>
      <NavLink className={logoutClass} onClick={handleLogout}>Logout</NavLink>
    </div>
  );
};

export default NavbarRoles;

