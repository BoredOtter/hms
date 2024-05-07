import React from 'react'
import { useEffect, useState } from 'react';
import httpResources from '../client/httpResources';
import ObjectDetails from '../components/utils/ObjectDetails';

const EmployeeSchedulesPage = ({employee_id}) => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchEmployeeSchedule = async () => {
      try{
        const response = await httpResources.get(`/get/employee_schedule/employee/${employee_id}`)
        const foundSchedules = response.data;
        setSchedules(foundSchedules);
      }catch(error){
        
      }
    }
    fetchEmployeeSchedule();
  }, [])

  return (
    <>
    <h2 className='text-3xl font-bold text-black-100 mb-8 text-center mt-10'>Schedules:</h2>
    <div className='grid sm:grid-cols-3 grid-cols-1'>
        
        {schedules.map(schedule => (
          <ObjectDetails key={schedule.ID_entry}>
          <>
            <div className='flex'>
              <p className='font-bold'>Schedule ID: </p> {schedule.ID_entry}
            </div>
            <div className='flex'>
              <p className='font-bold'>Start time: </p> {schedule.Start_time}
            </div>
            <div className='flex'>
              <p className='font-bold'>End time: </p> {schedule.End_time}
            </div>
            <div className='flex'>
              <p className='font-bold'>Date: </p> {schedule.Date}
            </div>
          </>
        </ObjectDetails>
        
        ))}
    </div>
   </>
  )
}

export default EmployeeSchedulesPage
