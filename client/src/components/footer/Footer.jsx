import React from 'react';
import { NavLink } from 'react-router-dom';


const Footer = () => {
    const year = new Date().getFullYear();

    return (
      <footer style={{backgroundColor: "#265073"}}className="text-xs text-white p-0.5 fixed bottom-0 w-full shadow-md mt-5">
        <div className='text-center'>
        <p className="py-1">Copyright © Hospital Management System {year}</p>
      </div>
      </footer>
    );
  };

export default Footer;
