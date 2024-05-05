import React from 'react'

const ObjectDetails = ({title, children}) => {
  return (
    <div className='flex justify-center'>
    <div className='bg-sky-100 mt-5 mb-10 rounded-lg shadow-lg p-8 text-center'>
      <h1 className='text-3xl font-bold mb-3'>{title}</h1>
      {children}
    </div>
  </div>
  )
}

export default ObjectDetails
