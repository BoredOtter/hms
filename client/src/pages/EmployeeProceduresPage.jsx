import React from 'react'
import loggedUser from '../auth/loggedUser';
import httpResources from '../client/httpResources';
import { useEffect, useState } from'react';
import ObjectDetails from '../components/utils/ObjectDetails';
import ObjectSlicer from '../components/utils/ObjectSlicer';

const EmployeeProceduresPage = ({employee_id}) => {
    const [procedures, setProcedures] = useState([]);
    const employee = loggedUser();
    

    useEffect(() => {
        const fetchProcedures = async () => {
          try {
            const response = await httpResources.get(`/get/operating_room_reservations/doctor/${employee_id}`);
            setProcedures(response.data);
          } catch (error) {
            console.error(error.response.data.detail);
          }
        };
        fetchProcedures();
      }, );
  return ( 
  <>
    <h2 className='text-3xl font-bold text-black-100 mb-8 text-center mt-10'>Procedures:</h2>
    <div className='grid sm:grid-cols-3 grid-cols-1'>
        
          {procedures.map(procedure => (
            <ObjectDetails key={procedure.ID_reservation}>
                <ObjectSlicer object={ procedure}></ObjectSlicer>
          </ObjectDetails>
          ))}
        </div>
        </>
  )
}

export default EmployeeProceduresPage
