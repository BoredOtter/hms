import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import WarningInfo from './WarningInfo';
import ObjectDetails from '../components/utils/ObjectDetails';
import bodyButton from '../components/utils/bodyButton';
import formInput from '../components/utils/formInput';
import { NavLink } from 'react-router-dom';
import httpResources from '../client/httpResources';
import OperatingRoomReservations from '../components/creators/OperatingRoomReservations';

const OperationRoomPage = () => {
    const { id } = useParams();
    const [operation_room, setOperation_room] = useState('');
    const [editedOperation_room, setEditedOperation_room] = useState('');
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchoperation_rooms = async () => {
      try {
        const response = await httpResources.get(`get/operating_room/id/${id}`);
        const foundOperation_rooms = response.data;
        if (foundOperation_rooms) {
          setOperation_room(foundOperation_rooms);
          setLoading(false);
        }
      } catch (error) {
        alert("Failed to fetch operating Room:");
        setLoading(false);
      }
    };

    fetchoperation_rooms();
  }, [id]); // Add id to the dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;


    setEditedOperation_room(prevState => ({
        ...prevState,
        [name]: parsedValue
    }));

};
    const handleDeleteRoom = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this operating room??");
        if (confirmDelete) {
        try {
          const response = await httpResources.delete(`/delete/operating_room/${operation_room.ID_operating_room}`);
          alert("Operating Room successfully deleted!");
          window.location.href = "/operating_rooms"
  
        } catch (error) {
          alert(error.response.data.detail);
        }
      } else {
        return;
      }
    }

  return (
    !loading ? (
      <>
      <ObjectDetails title={"Operating Room Information"}>
          {Object.entries(operation_room).map(([key, value]) => (
            (key !== "ID_operating_room") && (
              <div key={key} className="grid grid-cols-2 text-center my-2">
                <p className="font-bold mr-2 flex items-center justify-start">{key}:</p> {/* Apply justify-start to align text to the left */}
                {editedOperation_room && editedOperation_room['ID_operating_room'] === operation_room['ID_operating_room'] ? (
                  <input
                    type="text"
                    name={key}
                    value={editedOperation_room[key]}
                    onChange={handleChange}
                    className={`${formInput} flex items-center justify-center`} // Keep input centered
                  />
                ) : (
                  <p className="flex items-center justify-start">{typeof value === 'object' ? JSON.stringify(value) : value}</p>
                )}
              </div>
            )
          ))}
        <div className='flex justify-center gap-2'>
            <button className={bodyButton} onClick={handleDeleteRoom}>Delete</button>
            <NavLink className={`${bodyButton}`} to={'/operating_rooms'}>Back</NavLink>
        </div>
      </ObjectDetails>
      <OperatingRoomReservations ID_operating_room={id}></OperatingRoomReservations>
      </>
    ) : <WarningInfo loading={true} />
  );
}

export default OperationRoomPage
