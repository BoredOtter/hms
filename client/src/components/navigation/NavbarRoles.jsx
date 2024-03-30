import React from 'react'
import { NavLink } from 'react-router-dom';

const CURRENT_USER_TYPE = "nurse";

const NavbarRoles = () => {
    const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
      : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  return (
    (CURRENT_USER_TYPE === "nurse") ? 

    <>
    <NavLink to='/' className={linkClass}>Home</NavLink>
    <NavLink to='/departments' className={linkClass}>Departments</NavLink>
    <NavLink to='/register' className={linkClass}>Register patient</NavLink>
    </>
    : null
  );
}

export default NavbarRoles;
