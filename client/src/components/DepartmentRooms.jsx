import React, { useState } from 'react';
import bodyButton from './utils/bodyButton';
import { NavLink } from 'react-router-dom';

const DepartmentRooms = ({ rooms }) => {
    const [displayedRooms, setDisplayedRooms] = useState([]);
    const [editedRoom, setEditedRoom] = useState(null);

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

    const updateRoom = (roomId) => {
        console.log(`Update room with ID ${roomId}`);
        setEditedRoom(null);
    };

    const handleDeleteReservation = (reservationId) => {
        // Implement the logic to delete the reservation with the provided ID
        console.log(`Deleting reservation with ID ${reservationId}`);
    };

    return (
        <div className="container-xl lg:container m-auto mb-10 ">
            {rooms.map((room, index) => (
                <div key={index} className=" rounded-lg p-2 relative">
                    <div className='bg-sky-100 rounded-lg p-5'>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Room {room.ID_room}</h2>
                            <button
                                className={`${bodyButton}`}
                                onClick={() => toggleReservations(room['ID_room'])}
                            >
                                {displayedRooms.includes(room['ID_room']) ? 'Hide Bed Reservations' : 'Show Bed Reservations'}
                            </button>
                        </div>
                        <div className="flex flex-col md:flex-row md:space-x-6">
                            {Object.entries(room).map(([key, value]) => (
                                (key !== "ID_room" && key !== "bed_reservations" && key !== "ID_department") && (
                                    <div key={key} className="flex mb-2">
                                        <p className="font-bold mr-2">{key}:</p>
                                        {editedRoom && editedRoom['ID_room'] === room['ID_room'] ? (
                                            <input
                                                name={key}
                                                value={editedRoom[key]}
                                                onChange={(e) => setEditedRoom({ ...editedRoom, [key]: e.target.value })}
                                                className="border-b border-gray-400 focus:outline-none focus:border-indigo-500"
                                                inputmode="numeric"
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
                                <button className={bodyButton} onClick={() => setEditedRoom(room)}>Update Room</button>
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