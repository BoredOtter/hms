import React from 'react'

const ObjectSlicer = ({object}) => {
  return (
    <div className='text-center p-5'>
    {Object.keys(object).map((key) => (
        <p key={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}: {object[key]}
        </p>
    ))}
    </div>
  )
}

export default ObjectSlicer
