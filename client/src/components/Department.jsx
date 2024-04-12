import React from 'react'
import { NavLink } from 'react-router-dom'

const Department = ({department}) => {

  const hoverClass = 'h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center'
  return (
    <div className='bg-gray-200 mt-20 mb-20 rounded-lg shadow-lg p-8 mx-auto max-w-md text-center'>
      <h1 className='text-3xl font-bold mb-4'>Department Details</h1>
      <div className='mb-4'>
      <div className='text-lg'>
        {Object.keys(department).map((key) => (
          <p key={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}: {department[key]}
          </p>
        ))}
      </div>
      </div>
        <div className='text-center'>
            <div className='button space-x-2'>
                <NavLink
                    to={`/assortment/`}
                    className={hoverClass}>
                    Assortment
                </NavLink>
                <NavLink
                    to={`/departments/`}
                    className={hoverClass}>
                    Back
            </NavLink>
            </div>
        </div>
    </div>
  )
}

export default Department
