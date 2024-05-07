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
    const [operationRoomReservations, setOperationRoomReservations] = useState([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOperationRoomReservations = async () => {
      try{
        
        const response = await httpResources.get(`/get/operating_room_reservations/room/${id}`);
        const foundOperation_rooms = response.data;
        setOperationRoomReservations(foundOperation_rooms);
      }catch(error){}
    }
    fetchOperationRoomReservations();
  }, [])

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
  }, [id]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      let parsedValue = value;


      setEditedOperation_room(prevState => ({
          ...prevState,
          [name]: parsedValue
      }));

  };
    const handleDeleteRoom = async (reservation_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this operating room??");
        if (confirmDelete) {
        try {
          const response = await httpResources.delete(`/delete/operating_room_reservation/${reservation_id}`);
          alert("Operating Room successfully deleted!");
          window.location.href = "/operating_rooms"
  
        } catch (error) {
          alert(error.response.data.detail);
        }
      } else {
        return;
      }
    }

  const handleDeleteReservation = async (reservationId) => {
    try {
      await httpResources.delete(`/delete/operating_room_reservation/${reservationId}`);
      location.reload();
      alert('Reservation deleted successfully!');
    } catch (error) {
      alert(error.response.data.detail);
    }
  };

  return (
    !loading ? (
      <>
      <ObjectDetails title={"Operating Room Information"}>
          {Object.entries(operation_room).map(([key, value]) => (
            (key !== "ID_operating_room") && (
              <div key={key} className="grid grid-cols-2 text-center my-2">
                <p className="font-bold mr-2 flex items-center justify-start">{key}:</p> 
                {editedOperation_room && editedOperation_room['ID_operating_room'] === operation_room['ID_operating_room'] ? (
                  <input
                    type="text"
                    name={key}
                    value={editedOperation_room[key]}
                    onChange={handleChange}
                    className={`${formInput} flex items-center justify-center`}
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
      <h2 className='text-3xl font-bold text-black-100 mb-8 text-center'>Reservations</h2>
      <div className='grid sm:grid-cols-3 grid-cols-1'>
      {
        operationRoomReservations.map(operationRoomReservation => (
          <div key={operationRoomReservation.ID_reservation}>
            <ObjectDetails>
              <p>Reservation Date: {operationRoomReservation.Reservation_date}</p>
              <p>Start Time: {operationRoomReservation.Start_time}</p>
              <p>End Time: {operationRoomReservation.End_time}</p>
              <button className={`${bodyButton} mt-2`} onClick={() => handleDeleteReservation(operationRoomReservation.ID_reservation)}>Delete</button>
            </ObjectDetails>
          </div>
        )) 
      }
      </div>
      </>
    ) : <WarningInfo loading={true} />
  );
}

export default OperationRoomPage
