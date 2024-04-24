import React from 'react'
import ObjectDetails from './utils/ObjectDetails'
import formLabel from './utils/formLabel'
import formInput from './utils/formInput'
import bodyButton from './utils/bodyButton'
import { useState } from 'react'

const DepartmentCreation = () => {

    const [department, setDepartment] = useState({
    Department_name: '',
    Description: '',
    Contact_info: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartment(prevDepartment => ({
            ...prevDepartment,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted department:', department);
        setDepartment({
            Department_name: '',
            Description: '',
            Contact_info: ''
        });
    };

  
  return (

    <ObjectDetails title={"New Department"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='space-y-4'>
              <label className={formLabel}>
                  Department Name:
                  <input
                      type="text"
                      name="Department_name"
                      value={department.Department_name}
                      onChange={handleChange}
                      className={formInput}
                  />
              </label>
              <label className={formLabel}>
                  Description:
                  <input
                      type="text"
                      name="Description"
                      value={department.Description}
                      onChange={handleChange}
                      className={formInput}
                  />
              </label>
              <label className={formLabel}>
                  Contact Info:
                  <input
                      type="text"
                      name="Contact_info"
                      value={department.Contact_info}
                      onChange={handleChange}
                      className={formInput}
                  />
              </label>
          </div>
            <div className="flex justify-center space-x-4">
                <button type="submit" className={bodyButton}>Save</button>
            </div>
          </form>
    </ObjectDetails>
  )
}

export default DepartmentCreation
