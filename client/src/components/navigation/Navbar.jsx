import React from 'react'
import { NavLink } from 'react-router-dom';
import hospital from '../../assets/hospital.jpg';
import NavbarRoles from './NavbarRoles';

const Navbar = ({ loggedUser }) => {
  return (
    <nav className='bg-indigo-700 border-b border-indigo-700'>
      <div className='mx-auto px-1 sm:px-5 lg:px-8'>
        <div className='flex flex-col md:flex-row md:items-center justify-between'>
          <div className='flex ml-5 items-center justify-center md:justify-start pt-3'>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/home'>
              <img className='h-20 w-auto rounded-full mb-3' src={hospital} alt='Hospital' />
              <span className='hidden md:block text-white text-2xl ml-3 mt-1'>
                HMS
              </span>
            </NavLink>
          </div>
          <div className='md:flex md:space-x-2'>
            <NavbarRoles loggedUser={loggedUser} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

