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
        <NavLink to='/register' className={linkClass} exact="true">Register</NavLink>
        <NavLink to='/patients' className={linkClass} exact="true">Patients</NavLink>
        <NavLink to='/medications' className={linkClass} exact="false">Medications</NavLink>
        <NavLink className={logoutClass} onClick={handleLogout} exact="true">Logout</NavLink>
      </>
    );
}

export default NavbarRoles;
