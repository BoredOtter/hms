import React, { useState, useEffect } from 'react';
import bodyButton from './utils/bodyButton';
import { NavLink } from 'react-router-dom';
import httpResources from '../client/httpResources';
import formInput from './utils/formInput';

const DepartmentRooms = ({ID_department}) => {
    const [rooms, setRooms] = useState([]);
    const [displayedRooms, setDisplayedRooms] = useState([]);
    const [editedRoom, setEditedRoom] = useState(null);

    useEffect(() => {
        const fetchReservationRooms =  async () => {
            try{
                const response = await httpResources.get(`/get/rooms/department/${ID_department}`)
                const foundRooms = response.data;
                setRooms(foundRooms);
            }catch(error){
                alert(error.response.data.detail)
            }
        }

        fetchReservationRooms();
    }, [])

    const toggleReservations = (roomId) => {
        if (displayedRooms.includes(roomId)) {
            setDisplayedRooms(displayedRooms.filter(id => id !== roomId));
        } else {
            setDisplayedRooms([...displayedRooms, roomId]);
        }
    };

    const formatReservationInfo = (reservation) => {
        const spanLabel = "font-bold text-black";
        return (
            <>
                <p><span className={spanLabel}>Start Date:</span> {reservation.Start_date}</p>
                <p><span className={spanLabel}>Reservation ID:</span> {reservation.ID_reservation}</p>
                <p><span className={spanLabel}>Patient ID:</span> {reservation.ID_patient}</p>
                <p><span className={spanLabel}>Room ID:</span> {reservation.ID_room}</p>
                <p><span className={spanLabel}>End Date:</span> {reservation.End_date}</p>
            </>
        );
    };

    const updateRoom = async (roomId) => {
        try{
            await httpResources.patch(`/update/bed_in_room/${roomId}`,editedRoom)
            alert("Room changed successfully");
        }catch(error){
            alert(error.response.data.detail);
        }
        
    };

    const handleChange = (e, key) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) { 
            setEditedRoom((prevRoom) => ({
                ...prevRoom,
                [key]: inputValue
            }));
        }
    };

    const handleDeleteReservation = (reservationId) => {
        console.log(`Deleting reservation with ID ${reservationId}`);
    };

    return (
        <div className="container m-auto mb-10 ">
            {rooms.map((room, index) => (
                <div key={index} className=" rounded-lg p-2 relative">
                    <div className='bg-sky-100 rounded-lg p-5'>
                        <div className="justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Room {room.ID_room}</h2>
                        </div>
                        <div className="flex flex-col md:flex-row md:space-x-6">
                            {Object.entries(room).map(([key, value]) => (
                                (key !== "ID_room" && key !== "bed_reservations" && key !== "ID_department") && (
                                    <div key={key} className="flex mb-2 flex items-center">
                                        <p className="font-bold mr-2">{key}:</p>
                                        {editedRoom && editedRoom['ID_room'] === room['ID_room'] ? (
                                            <input
                                                name={key}
                                                value={editedRoom[key]}
                                                onChange={(e) => handleChange(e, key)}  
                                                className={formInput}
                                                inputMode="numeric"
                                            />
                                        ) : (
                                            <p>{typeof value === 'object' ? JSON.stringify(value) : value}</p>
                                        )}
                                    </div>
                                )
                            ))}
                            
                        </div>
                        <div className="flex justify-end items-end mt-2 md:mt-0 space-x-2">
                            {editedRoom && editedRoom['ID_room'] === room['ID_room'] ? (
                                <>
                                    <button className={bodyButton} onClick={() => updateRoom(room['ID_room'])}>Save Changes</button>
                                    <button className={bodyButton} onClick={() => setEditedRoom(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                <button className={bodyButton} onClick={() => setEditedRoom(room)}>Update Room</button>
                                <button
                                className={`${bodyButton}`}
                                onClick={() => toggleReservations(room['ID_room'])}
                            >
                                {displayedRooms.includes(room['ID_room']) ? 'Hide Reservations' : 'Show Reservations'}
                            </button>
                            </>
                            )}
                        </div>
                    </div>
                    {/* Display bed reservations for the clicked room */}
                    {displayedRooms.includes(room['ID_room']) && room['bed_reservations'] && room['bed_reservations'].length > 0 && (
                        <div className="bg-sky-100 grid grid-cols-1 md:grid-cols-2 rounded-lg p-2 relative gap-6 mt-5">
                            {room['bed_reservations'].map((reservation, idx) => (
                                <div key={idx} className="bg-gray-200 rounded-lg shadow-md p-6 mt-4 mr-5 ml-5">
                                    {formatReservationInfo(reservation)}
                                    <div className='mt-5 space-x-2'>
                                        <NavLink to={`/patients/${reservation.ID_patient}`} className={`${bodyButton} pt-2.5`}>Check Patient</NavLink>
                                        <button className={bodyButton} onClick={() => handleDeleteReservation(reservation.ID_reservation)}>Delete reservation</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

};

export default DepartmentRooms;
