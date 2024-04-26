import React from 'react'
import { useParams } from 'react-router-dom'

const EmployeeSchedule = () => {
    const {id} = useParams();
  return (
   console.log(id)
  )
}

export default EmployeeSchedule
