import React from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'

const EmployeeSchedulePage = () => {
    const {id} = useParams();
    const [schedules, setSchedules] = useState([]);
  
  useEffect(() => {
    const fetchSchedules = async () => {
      try{
        const response = await httpResources.get(`/get/employee_schedule/employee/${id}`)
        const foundSchedules = response.data;
        setSchedules(foundSchedules);
      }catch(error){
        alert(error.response.data.detail);
      }
    }
    fetchSchedules();
  }, [])
  return (
   console.log(id)
  )
}

export default EmployeeSchedulePage
