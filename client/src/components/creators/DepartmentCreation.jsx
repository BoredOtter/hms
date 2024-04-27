import React from 'react'
import ObjectDetails from '../utils/ObjectDetails'
import formLabel from '../utils/formLabel'
import formInput from '../utils/formInput'
import bodyButton from '../utils/bodyButton'
import httpResources from '../../client/httpResources'
import { useState } from 'react'

const DepartmentCreation = ({refresh}) => {

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const key in department) {
            if (!department[key]) {
                alert("Please fill in all fields.");
                return;
            }
        }

        try{
            const response = await httpResources.post("/create/department",department);
            alert("Department sucessfully added!");
            refresh();
          } catch(error){
            alert(error.response.data.detail);
            return Promise.reject(error);
          }
        setDepartment({
            Department_name: '',
            Description: '',
            Contact_info: ''
        });
    };

  
  return (

    <ObjectDetails title={"Create new Department"}>
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
                <button type="submit" onClick={handleSubmit} className={bodyButton}>Save</button>
            </div>
          </form>
    </ObjectDetails>
  )
}

export default DepartmentCreation
