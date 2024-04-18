import React from 'react';
import { NavLink } from 'react-router-dom';
import keycloak from '../../auth/keycloak';


const CURRENT_USER_TYPE = "doctor";

const handleLogout = () => {
      
  keycloak.logout();
 
};

const NavbarRoles = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  const logoutClass = () =>
    'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  return (
      <>
        <NavLink to='/home' className={linkClass} exact="true" >Home</NavLink>
        <NavLink to='/departments' className={linkClass}>Departments</NavLink>
        {(CURRENT_USER_TYPE === "nurse") ? 
          <>
            <NavLink to='/register' className={linkClass} exact="true">Register patient</NavLink>
          </>
          : (CURRENT_USER_TYPE === "doctor") ?
            <>
              <NavLink to='/patients' className={linkClass} exact="true">Patients</NavLink>
            </>
            : null
        }
        <NavLink className={logoutClass} onClick={handleLogout} exact="true">Logout</NavLink>
      </>
    );
}

export default NavbarRoles;
