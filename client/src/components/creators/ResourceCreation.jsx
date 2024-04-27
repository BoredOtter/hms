import React from 'react'
import { useState } from 'react'
import ObjectDetails from '../utils/ObjectDetails';
import formLabel from '../utils/formLabel';
import formInput from '../utils/formInput';
import bodyButton from '../utils/bodyButton';
import httpResources from '../../client/httpResources';

const ResourceCreation = ({ID_department}) => {

    const [resource, setResource] = useState({
        Resource_name: '',
        Description: '',
        Available_quantity: '',
        Department_id: ID_department
    });
    const handleChange = (e) => {
    const { name, value } = e.target;
        if (name === 'Available_quantity' && value.length === 1 && value === '0') {
            // If the value is '0', do not update the state
            return;
        }
        if (name === 'Available_quantity' && !/^\d*$/.test(value)) {
            // If the value contains non-digit characters, do not update the state
            return;
        }
        // Update the state with the new value
        setResource(prevResource => ({
            ...prevResource,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(resource);
    
        // Parse Available_quantity to an integer
        const availableQuantity = parseInt(resource.Available_quantity);
    
        // Check if any field is empty
        for (const key in resource) {
            if (!resource[key]) {
                alert("Please fill in all fields.");
                return;
            }
        }
    
        // Check if Available_quantity is a valid integer
        if (isNaN(availableQuantity)) {
            alert("Available quantity must be a number.");
            return;
        }
    
        try {
            // Send the parsed Available_quantity to the server
            await httpResources.post("/create/material_resource", {
                ...resource,
                Available_quantity: availableQuantity
            });
            alert("Resource successfully added!");
        } catch (error) {
            alert(error.response.data.detail);
        }
    
        // Reset the resource state
        setResource({
            Resource_name: '',
            Description: '',
            Available_quantity: '',
            Department_id: ID_department
        });
    };
    
  return (
    <ObjectDetails title={"Add new resource"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='space-y-4'>
              <label className={formLabel}>
                  Resource Name:
                  <input
                      type="text"
                      name="Resource_name"
                      value={resource.Resource_name}
                      onChange={handleChange}
                      className={formInput}
                  />
              </label>
              <label className={formLabel}>
                  Description:
                  <input
                      type="text"
                      name="Description"
                      value={resource.Description}
                      onChange={handleChange}
                      className={formInput}
                  />
              </label>
              <label className={formLabel}>
                  Available quantity:
                  <input
                      type="text"
                      name="Available_quantity"
                      value={resource.Available_quantity}
                      onChange={handleChange}
                      className={formInput}
                      inputMode={'numeric'}
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

export default ResourceCreation
