import React from 'react'

const ObjectSlicer = ({ object }) => {
  const renderValue = (value) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return <ObjectSlicer object={value} />;
    } else {
      return value;
    }
  };

  return (
    <div className='text-center p-5'>
      {Object.entries(object).map(([key, value]) => (
        <div key={key} className='flex'>
          <p className="font-bold">{key.charAt(0).toUpperCase() +  key.slice(1)}:</p>
          {renderValue(value)}
        </div>
      ))}
    </div>
  );
};

export default ObjectSlicer
