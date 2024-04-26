import React from 'react'

const ObjectDetails = ({title, children}) => {
  return (
    <div className='bg-gray-200 ml-5 mr-5 mt-5 rounded-lg shadow-lg p-8 mx-auto max-w-md text-center'>
        <h1 className='text-3xl font-bold'>{title}</h1>
        {children}
    </div>
  )
}

export default ObjectDetails
