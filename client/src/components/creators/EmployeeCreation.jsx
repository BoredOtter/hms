import React from 'react'
import { useState } from 'react';
import formInput from '../utils/formInput';
import formLabel from '../utils/formLabel';
import ObjectDetails from '../utils/ObjectDetails';
import httpResources from '../../client/httpResources';
import bodyButton from '../utils/bodyButton';

const formatPESEL = (pesel) => {
    const cleaned = ('' + pesel).replace(/\D/g, '');
    return cleaned.slice(0, 11); // Ensure only 11 digits are displayed
};

const EmployeeCreation = ({ID_department}) => {
    
    const [employee, setEmployee] = useState({
        PESEL: '',
        First_name: '',
        Last_name: '',
        Employment_date: '',
        Position: '',
        Department_id: parseInt(ID_department)
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

      const handleAddEmployee = async () => {
        console.log(employee)
        try{
            await httpResources.post("/create/employee", employee)
            setEmployee({
              PESEL: '',
              First_name: '',
              Last_name: '',
              Employment_date: '',
              Position: '',
              Department_id: parseInt(ID_department)
            })
            alert("Employee added successfully!")
        }catch(error){
            alert(error.response.data.detail)
        }
      }
  return (
   <ObjectDetails title={"Register new Employee"}>

    <form>
        <label className={formLabel}>First Name:</label>
          <input
            type="text"
            name="First_name"
            value={employee.First_name}
            onChange={handleChange}
            className={formInput}
          />
        
        <label className={formLabel}>Last Name:</label>
          <input
            type="text"
            name="Last_name"
            value={employee.Last_name}
            onChange={handleChange}
            className={formInput}
          />

        <label className={formLabel}>PESEL:</label>
          <input
            type="text"
            name="PESEL"
            value={formatPESEL(employee.PESEL)}
            onChange={handleChange}
            className={formInput}
          />

        <label className={formLabel}>Employment Date:</label>
          <input
            type="date"
            name="Employment_date"
            value={employee.Employment_date}
            onChange={handleChange}
            className={formInput}
          />
          <label className={formLabel}>Position:</label>
          <input
            type="text"
            name="Position"
            value={employee.Position}
            onChange={handleChange}
            className={formInput}
          />
      </form>
      <button className={`${bodyButton} mt-2`} onClick={handleAddEmployee}>Add</button>
   </ObjectDetails>
  )
}

export default EmployeeCreation
