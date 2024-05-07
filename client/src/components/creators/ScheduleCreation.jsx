import React from 'react'
import httpResources from '../../client/httpResources'
import { useState, useEffect } from 'react'
import formInput from '../utils/formInput'
import formLabel from '../utils/formLabel'
import bodyButton from '../utils/bodyButton'
import currentDate from '../utils/currentDate'
import ObjectDetails from '../utils/ObjectDetails'

const ScheduleCreation = ({refresh,employee_id}) => {

    const [schedule, setSchedule] = useState({
        Date: currentDate,
        Start_time: '',
        End_time: '',
        Employee_uuid: employee_id
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSchedule(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await httpResources.post('/create/employee_schedule', schedule);
            refresh()
            alert('Schedule created successfully!');
            setSchedule({
                Date: '',
                Start_time: '',
                End_time: '',
                Employee_uuid: employee_id
            });
        } catch (error) {
        }
    };
    
  return (
    <ObjectDetails title={"Create new Schedule"}>
    <form>
        <label className={formLabel}>Date:</label>
          <input
            type="date"
            name="Date"
            value={schedule.Date}
            onChange={handleChange}
            className={formInput}
          />
        
        <label className={formLabel}>Start time:</label>
          <input
            type="time"
            name="Start_time"
            value={schedule.Start_time}
            onChange={handleChange}
            className={formInput}
          />

        <label className={formLabel}>End time:</label>
          <input
            type="time"
            name="End_time"
            value={schedule.End_time}
            onChange={handleChange}
            className={formInput}
          />

          <button className={`${bodyButton} mt-3`} onClick={handleSubmit}>Save</button>
      </form>
      </ObjectDetails>
  )
}

export default ScheduleCreation
