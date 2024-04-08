import { useState } from 'react';
import { Link } from 'react-router-dom';

const DepartmentListing = ({ department }) => {

  return (
    <div className='bg-white rounded-xl shadow-md relative'>

        <div className=' text-center p-5 '>
          <h3 className='text-xl font-bold'>{department.name}</h3>
          <div className='button mt-3'>
            <Link
            to={`/departments/${department.id}`}
            className='h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center'
          >
            Check
          </Link></div>
          
        </div>
    </div>

  );
};
export default DepartmentListing;