import React from 'react'
import { Outlet } from 'react-router-dom'

const ObjectDetails = ({title, children}) => {
  return (
    <div className='bg-gray-200 mt-20 mb-20 rounded-lg shadow-lg p-8 mx-auto max-w-md text-center'>
        <h1 className='text-3xl font-bold'>{title}</h1>
        {children}
    </div>
  )
}

export default ObjectDetails
