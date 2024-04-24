import React from 'react'
import bodyButton from './utils/bodyButton'
import { useState } from 'react';

const DepartmentResources = ({ resources }) => {
    const [editedResource, setEditedResource] = useState(null);
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setEditedResource(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
  
    const handleSaveChanges = (resourceId) => {
      console.log("Saved changes for resource with ID:", resourceId);
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
                      <div key={key} className="font-bold text-l flex mb-2">
                        <p className="font-bold mr-2">{key}:</p>
                        {editedResource && editedResource['ID_resource'] === resource['ID_resource'] ? (
                          <input 
                            type="text" 
                            name={key} 
                            value={editedResource[key]} 
                            onChange={handleChange} 
                            className="border-b border-gray-400 focus:outline-none focus:border-indigo-500 flex-grow"
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
                      <button className={bodyButton} onClick={handleSaveChanges}>Save Changes</button>
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