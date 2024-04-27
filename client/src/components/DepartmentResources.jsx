import React from 'react'
import bodyButton from './utils/bodyButton'
import { useState } from 'react';
import { useEffect } from 'react';
import httpResources from '../client/httpResources';
import formInput from './utils/formInput';

const DepartmentResources = ({ ID_department }) => {
    const [editedResource, setEditedResource] = useState(null);
    const [resources, setResources] = useState([]);

    useEffect(() => {
      const fetchDepartmentResources = async () => {
        try{
          const response = await httpResources.get(`/get/material_resource/all/${ID_department}`)
          const foundResources = response.data;
          setResources(foundResources);
        }catch(error){
          alert(error.response.data.detail);
        }
      }
      fetchDepartmentResources();
    }, [])

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === 'Available_quantity' && value === '0') {
          // If the value is '0', update the state
          setEditedResource(prevEditedResource => ({
              ...prevEditedResource,
              [name]: value
          }));
          return;
      }
      if (name === 'Available_quantity' && !/^\d*$/.test(value)) {
          // If the value contains non-digit characters, do not update the state
          return;
      }
      // Update the editedResource state
      setEditedResource(prevEditedResource => ({
          ...prevEditedResource,
          [name]: value
      }));
  };
  
    const handleSaveChanges = (ID_resource) => {
      const index = resources.findIndex(resource => resource.ID_resource === ID_resource);
        if (index === -1) {
          console.error('Resource not found.');
          return;
        }
        httpResources.patch("/")
        setResources(prevResources => {
        const updatedResources = [...prevResources];
        updatedResources[index] = editedResource;
        return updatedResources;
      });
      setEditedResource(null);
    };
  
  
    const handleCancelEdit = () => {
      setEditedResource(null);
    };
  
    return (
      <div className='container-xl lg:container m-auto'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, index) => (
            <div key={index} className="bg-sky-100 rounded-xl p-3.5 hover:bg-sky shadow-md hover:shadow-lg relative mb-10">
              <div className="flex flex-col md:flex-row md:space-x-6">
                <div className="md:flex-1">
                {Object.entries(resource).map(([key, value]) => (
                    (key !== "ID_resource" && key !== "Department_id") && (
                        <div key={key} className="grid grid-cols-2 justify-center items-center">
                            <div className="my-3">
                                <p className="font-bold mr-2">{key}:</p>
                            </div>
                            {editedResource && editedResource['ID_resource'] === resource['ID_resource'] ? (
                                <input 
                                    type="text" 
                                    name={key} 
                                    value={editedResource[key]} 
                                    onChange={(e) => handleChange(e)} 
                                    className={formInput}
                                />
                            ) : (
                                <p>{typeof value === 'object' ? JSON.stringify(value) : value}</p>
                            )}
                        </div>
                    )
                ))}
                </div>
                <div className="flex flex-col justify-end md:justify-start md:items-end mt-2 md:mt-0">
                  {editedResource && editedResource['ID_resource'] === resource['ID_resource'] ? (
                    <div className="mt-2 md:mt-0 space-x-2 space-y-2">
                      <button className={bodyButton} onClick={() => handleSaveChanges(resource.ID_resource)}>Save Changes</button>
                      <button className={bodyButton} onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  ) : (
                    <button className={bodyButton} onClick={() => setEditedResource(resource)}>Update Resource</button>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      );
      
  };
  
  export default DepartmentResources;