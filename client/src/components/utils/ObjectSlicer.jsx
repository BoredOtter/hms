import React from 'react';

const ObjectSlicer = ({ object }) => {
  const renderValue = (value) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return <ObjectSlicer object={value} />;
    } else {
      return value;
    }
  };

  return (
    <div className='text-center p-3'>
      {Object.entries(object).map(([key, value]) => {
        const formattedKey = key.split('_').join(' '); // Zamienia podkreślenia na spacje
        return (
          <div key={key} className='flex flex-wrap'>
            <p className="font-bold">{formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1)}:</p>
            {renderValue(value)}
          </div>
        );
      })}
    </div>
  );
};

export default ObjectSlicer;
