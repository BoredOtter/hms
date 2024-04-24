import { useState, useEffect } from 'react';
import "../styles/styles.css"

const Home = ({userName}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

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

  return (
    <div className='form-container bg-gray-200'>
      <h1 className='text-3xl mb-4'>Welcome to Home Page</h1>
      <div className='mb-4'>
        <p className='text-lg'>Logged User:</p>
        <p className='text-xl'>{userName}</p>
      </div>
      <div>
        <p className='text-lg'>Current Time:</p>
        <p className='text-xl'>{currentTime}</p>
        <p className='text-lg mt-4'>Current Date:</p>
        <p className='text-xl'>{currentDate}</p>
      </div>
    </div>
  );
};

export default Home;
