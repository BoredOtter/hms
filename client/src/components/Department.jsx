import React from 'react'
import { NavLink } from 'react-router-dom'
import ObjectSlicer from './utils/ObjectSlicer'
import ContainerDetails from './utils/ContainerDetails'
import bodyButton from './utils/bodyButton'

const Department = ({department}) => {

  return (
    <ContainerDetails title={"Department Details"}>
        <ObjectSlicer object={department}/>
        <div className='button space-x-2 text-center'>
            <NavLink
                to={`/assortment/`}
                className={bodyButton}>
                Assortment
            </NavLink>
            <NavLink
                to={`/departments/`}
                className={bodyButton}>
                Back
            </NavLink>
        </div>
    </ContainerDetails>
  )
}

export default Department
