import React from 'react'
import { NavLink } from 'react-router-dom';
import hospital from '../../assets/hospital.jpg';
import NavbarRoles from './NavbarRoles';

const Navbar = () => {
  return (
    <nav style={{backgroundColor: "#265073"}}>
      <div className='mx-auto px-1 sm:px-5 lg:px-8'>
        <div className='flex flex-col md:flex-row md:items-center justify-between'>
          <div className='flex ml-5 items-center justify-center md:justify-start pt-3'>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/home'>
              <img className='h-10 w-auto rounded-full mb-3' src={hospital} alt='Hospital' />
            </NavLink>
          </div>
          <div className='md:flex md:space-x-2'>
            <NavbarRoles/>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

