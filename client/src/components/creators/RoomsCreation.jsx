import React from 'react'
import { useState } from 'react'
import formInput from '../utils/formInput';
import bodyButton from '../utils/bodyButton';
import ObjectDetails from '../utils/ObjectDetails';
import httpResources from '../../client/httpResources';


const RoomsCreation = ({ID_department}) => {
    const [beds, setBeds] = useState('');

    // Function to handle input change
    const handleChange = (event) => {
        const input = event.target.value;
        const regex = /^[0-9\b]+$/; // Regular expression to match numbers only

        // Check if the input matches the regex pattern
        if (input === '' || regex.test(input)) {
            setBeds(input); // Update the beds state with the new value
        }
    };

    const handleSumbit = async () => {
        try{
            await httpResources.post("/create/room", {
                ID_department: `${ID_department}`,
                Number_of_beds: beds
            })
            alert("Room added successfully!")
        }catch(error){
            alert(error.response.data.detail)
            Promise.reject(error)
        }
    } 

    return (
        
            <ObjectDetails title={"Add new room"}>
                <div className='space-y-3'>
                <input
                    name='Beds'
                    type="text" 
                    className={`${formInput} mt-3`} 
                    placeholder="Bed numbers"
                    value={beds} // Set the value of the input field to the beds state
                    onChange={handleChange} // Call handleChange function when the input value changes
                />
                <button className={bodyButton} onClick={handleSumbit}>Add</button>
                </div>
            </ObjectDetails>
    );
};

export default RoomsCreation
