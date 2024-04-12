import { useState } from 'react';
import { Link } from 'react-router-dom';

const ObjectListing = ({ object, objectLink, display }) => {
  return (
    <div className='bg-white rounded-xl shadow-md relative'>
      <div className='text-center p-5'>
        <div className='flex justify-center space-x-1'>
          {display.map((property) => (
            <h3 key={property} className='text-xl font-bold'>
              {object[property]} 
            </h3>
          ))}
        </div>
        <div className='button mt-3'>
          <Link
            to={`${objectLink}/${object.id}`}
            className='h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center'
          >
            Check
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ObjectListing;
