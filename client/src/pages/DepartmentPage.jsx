import React from 'react'
import departments from '../../departments.json'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const DepartmentPage = () => {
  const {id} = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Find the department with the given ID
    const foundDepartment = departments.departments.find(dep => dep.id === id);
    if (foundDepartment) {
      setDepartment(foundDepartment);
      setLoading(false); // Set loading to false once department is found
    }
  }, [id]);

  return (
    <div className='bg-gray-200 mt-20 rounded-lg shadow-lg p-8 mx-auto max-w-md'>
      <h1 className='text-3xl font-bold mb-4'>Department Details</h1>
      <div className='mb-4'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          department ? (
            <div>
              <p className='text-lg'>ID: {department.id}</p>
              <p className='text-lg'>Name: {department.name}</p>
            </div>
          ) : (
            <p>Department not found!</p>
          )
        )}
      </div>
      <div className='button mt-3'>
            <Link
            to={`/departments/`}
            className='h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center'
          >
            Back
          </Link></div>
    </div>
  );
};

export  { DepartmentPage as default}
