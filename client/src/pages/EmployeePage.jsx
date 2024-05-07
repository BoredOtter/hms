import React from 'react'
import ScheduleCreation from '../components/creators/ScheduleCreation'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ObjectDetails from '../components/utils/ObjectDetails';
import httpResources from '../client/httpResources';
import bodyButton from '../components/utils/bodyButton';

const EmployeePage = () => {
  const {id} = useParams();
  const [schedules, setSchedules] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  const refresh = () => {
    setRefreshing(!refreshing);
  }

  useEffect(() => {
    const fetchEmployeeSchedule = async () => {
      try{
        const response = await httpResources.get(`/get/employee_schedule/employee/${id}`)
        const foundSchedules = response.data;
        setSchedules(foundSchedules);
      }catch(error){
        
      }
    }
    fetchEmployeeSchedule();
  }, [refreshing])

  const handleDeleteSchedule = async (schedule_id) => {
    try{
      await httpResources.delete(`/delete/employee_schedule/${schedule_id}`)
      alert("Schedule deleted successfully!")
      location.reload();
    }catch(error){
      alert(error.response.data.detail);
    }
  }
  return (
    <>
      <ScheduleCreation refresh={refresh} employee_id={id}></ScheduleCreation>
      <div className='grid sm:grid-cols-3 '>
        {
          schedules.map(schedule => (
            <ObjectDetails key={schedule.ID_entry}>
              <p>Schedule ID: {schedule.ID_entry}</p>
              <p>Start time: {schedule.Start_time}</p>
              <p>End time: {schedule.End_time}</p>
              <p>date: {schedule.Date}</p>
              <div>
                <button className={bodyButton} onClick={() => handleDeleteSchedule(parseInt(schedule.ID_entry))}>Delete</button>
                </div>
            </ObjectDetails>
          ))}
      </div>
    </>
  )
}

export default EmployeePage
