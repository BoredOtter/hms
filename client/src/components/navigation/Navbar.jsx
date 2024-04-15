import React from 'react'
import { NavLink } from 'react-router-dom';
import hospital from '../../assets/hospital.jpg';
import NavbarRoles from './NavbarRoles';

const Navbar = () => {
  return (
    <nav className='bg-indigo-700 pt-2 border-b border-indigo-700'>
      <div className='mx-auto  px-1 sm:px-5 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          <div className='flex flex-1 items-center justify-center md:justify-start'>
            <NavLink className='flex flex-shrink-0 items-center mr-4' to='/home'>
              <img className='h-10 w-auto rounded-full mb-3' src={hospital} alt='Hospital' />
              <span className='hidden md:block text-white text-2xl ml-3 mt-1'>
                HMS
              </span>
            </NavLink>
            <div className='md:ml-auto '>
              <div className='flex space-x-2 mb-1'>
                <NavbarRoles />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
