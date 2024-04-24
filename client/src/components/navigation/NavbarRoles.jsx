import React from 'react';
import { NavLink } from 'react-router-dom';
import keycloak from '../../auth/keycloak';


// const CURRENT_USER_TYPE = "doctor";

const handleLogout = () => {
      
  keycloak.logout();
 
};

const NavbarRoles = ({loggedUser}) => {
  const CURRENT_USER_TYPE = loggedUser
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  const logoutClass = () =>
    'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  return (
      <>
        <NavLink to='/departments' className={linkClass}>Departments</NavLink>
        <NavLink to='/register' className={linkClass}>Register</NavLink>
        <NavLink to='/patients' className={linkClass}>Patients</NavLink>
        <NavLink to='/medications' className={linkClass}>Medications</NavLink>
        {/* <NavLink to='/schedule' className={linkClass}>Schedule</NavLink>  FOR NOW*/}
        <NavLink className={logoutClass} onClick={handleLogout}>Logout</NavLink>
      </>
    );
}

export default NavbarRoles;
