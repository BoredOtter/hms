import React from 'react'
import departments from '../../departments.json'
import ObjectsListing from '../components/listing/ObjectsListing';
import bodyButton from '../components/utils/bodyButton';
import { useState } from 'react';
import formLabel from '../components/utils/formLabel';
import formInput from '../components/utils/formInput';
import ObjectDetails from '../components/utils/ObjectDetails';

const departmentsData = departments.departments || [];

const DepartmentsPage = () => {


  const [creatingDepartment, setCreateDepartment] = useState(false);

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
    // Handle submission, e.g., send data to server
    console.log('Submitted department:', department);
    // Reset form after submission
    setDepartment({
        Department_name: '',
        Description: '',
        Contact_info: ''
    });
};

  const handleCreateNewDepartment = () => {
    setCreateDepartment(!creatingDepartment);
  }
  return (
    <>
    <div className='flex justify-center mt-10'>
      <button className={bodyButton} onClick={handleCreateNewDepartment}> Create new Department</button>
    </div>
    
    {
      creatingDepartment && (
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
    )}
    
    
    <ObjectsListing 
      objectsData={departmentsData} 
      objectsTitle={"Departments"}
      objectLink={"/departments"}
      objectKey={"id"}
      />
    </>
  )
}

export default DepartmentsPage;
