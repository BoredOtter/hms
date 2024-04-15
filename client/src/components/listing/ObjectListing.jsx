import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ObjectSlicer from '../utils/ObjectSlicer';

const ObjectListing = ({ object, objectLink }) => {
  return (
    <NavLink to={objectLink ? `${objectLink}/${object.id}` : null}>
      <div className='bg-sky-100 rounded-xl p-3.5 hover:bg-sky shadow-md hover:shadow-lg relative'>
        <ObjectSlicer object={object}/>
      </div>
    </NavLink>
  );
};

export default ObjectListing;
