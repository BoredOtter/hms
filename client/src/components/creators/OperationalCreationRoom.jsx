import React from 'react'
import { useState } from 'react'
import formInput from '../utils/formInput';
import bodyButton from '../utils/bodyButton';
import ObjectDetails from '../utils/ObjectDetails';
import httpResources from '../../client/httpResources';


const OperationalRoomCreation = ({ID_department}) => {
    const [name, setName] = useState('');

    // Function to handle input change
    const handleChange = (event) => {
        const input = event.target.value;
        setName(input); // Update the beds state with the new value

    };

    const handleSumbit = async () => {
        try{
            await httpResources.post("/create/operating_room", {
                ID_department: `${ID_department}`,
                Room_name: name
            })
            alert("Room added successfully!")
            setName('');
        }catch(error){
            alert(error.response.data.detail)
        }
    } 

    return (
            <ObjectDetails title={"Add new operating room"}>
                <div className='space-y-3'>
                <input
                    name='Room_name'
                    type="text" 
                    className={`${formInput} mt-3`} 
                    placeholder="Room name"
                    value={name}
                    onChange={handleChange}
                />
                <button className={bodyButton} onClick={handleSumbit}>Add</button>
                </div>
            </ObjectDetails>
    );
};

export default OperationalRoomCreation
