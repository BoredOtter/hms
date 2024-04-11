import React from 'react'
import { NavLink } from 'react-router-dom'

const Department = ({department}) => {
  return (
    <div className='bg-gray-200 mt-20 rounded-lg shadow-lg p-8 mx-auto max-w-md'>
      <h1 className='text-3xl font-bold mb-4'>Department Details</h1>
      <div className='mb-4'>
        <div>
            <p className='text-lg'>ID: {department.id}</p>
            <p className='text-lg'>Name: {department.name}</p>
        </div>
      </div>
        <div className='text-center'>
            <div className='button space-x-2'>
                <NavLink
                    to={`/patients/`}
                    className='h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center'>
                    Patients
                </NavLink>
                <NavLink
                    to={`/assortment/`}
                    className='h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center'>
                    Assortment
                </NavLink>
                <NavLink
                    to={`/departments/`}
                    className='h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center'>
                    Back
            </NavLink>
            </div>
        </div>
    </div>
  )
}

export default Department
