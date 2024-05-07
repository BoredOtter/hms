import { useState, useEffect } from 'react';
import bodyButton from '../components/utils/bodyButton';
import keycloak from '../auth/keycloak';
import "../styles/styles.css"
import ObjectsListing from '../components/listing/ObjectsListing'
import loggedUser from '../auth/loggedUser';
import httpResources from '../client/httpResources';

const Home = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [schedules, setSchedules] = useState([]);
  const employee = loggedUser();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
      const dateString = now.toLocaleDateString('en-US', dateOptions);
      const timeString = now.toLocaleTimeString('en-US', timeOptions);
      setCurrentDate(dateString);
      setCurrentTime(timeString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);


  useEffect (() => {
      const fetchSchedules = async () => {
        try{
        const response = await httpResources.get(`/get/employee_schedule/employee/${employee.uuid}`)
        const foundSchedules = response.data;
        setSchedules (foundSchedules);
        }catch(error){
        }
      }
      fetchSchedules();
  }, [])

  return (
    <>
    <div className='form-container bg-gray-200'>
      <h1 className='text-3xl mb-4'>Welcome to Home Page</h1>
      <div className='mb-4'>
        <p className='text-lg'>Logged User:</p>
        <p className='text-xl'>{employee.name}</p>
      </div>
      <div>
        <p className='text-lg'>Current Time:</p>
        <p className='text-xl'>{currentTime}</p>
        <p className='text-lg mt-4'>Current Date:</p>
        <p className='text-xl'>{currentDate}</p>
        <div className='flex justify-center'><button className={`${bodyButton} mt-5`} onClick={() => keycloak.logout()}> Logout</button></div>

      </div>
    </div>
    <h2 className='text-3xl font-bold text-indigo-500 mb-8 text-center mt-10'>Schedules:</h2>

    <div className='grid sm:grid-cols-3 flex '>
        {
          schedules.map(schedule => (
            <ObjectDetails title={"Schedule"}>
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
  );
};

export default Home;
