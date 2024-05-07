import React, { useState, useEffect } from 'react';
import bodyButton from './utils/bodyButton';
import { NavLink } from 'react-router-dom';
import httpResources from '../client/httpResources';
import formInput from './utils/formInput';

const DepartmentRooms = ({ ID_department }) => {
    const [rooms, setRooms] = useState([]);
    const [editedRoom, setEditedRoom] = useState(null);

    useEffect(() => {
        const fetchReservationRooms = async () => {
            try {
                const response = await httpResources.get(`/get/rooms/department/${ID_department}`);
                const foundRooms = response.data;
                setRooms(foundRooms);
            } catch (error) {
                alert(error.response.data.detail);
            }
        };

        fetchReservationRooms();
    }, []);

    const updateRoom = async (roomId) => {
        try {
            await httpResources.patch(`/update/bed_in_room/${roomId}`, editedRoom);
            alert("Room changed successfully");

            // Update room values in the rooms state after successful update
            setRooms(prevRooms =>
                prevRooms.map(room => {
                    if (room.ID_room === editedRoom.ID_room) {
                        return { ...room, ...editedRoom };
                    }
                    return room;
                })
            );

            setEditedRoom(null); // Reset editedRoom state after successful update
        } catch (error) {
            alert(error.response.data.detail);
        }
    };

    const handleDeleteRoom = async (room) => {
        try {
            await httpResources.delete(`/delete/room/${room.ID_room}`);
            alert("Room deleted successfully");

            // Remove the deleted room from the rooms state
            setRooms(prevRooms =>
                prevRooms.filter(r => r.ID_room !== room.ID_room)
            );
        } catch (error) {
            alert(error.response.data.detail);
        }
    };

    const handleChange = (e, key) => {
        const inputValue = e.target.value;
        setEditedRoom((prevRoom) => ({
            ...prevRoom,
            [key]: inputValue
        }));
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 mb-10 mt-4">
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
                                                value={editedRoom[key] || ""}
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
                                        <NavLink className={bodyButton} to={`/rooms/${room['ID_room']}`}>Show reservation</NavLink>
                                        <button className={bodyButton} onClick={() => handleDeleteRoom(room)}>Delete</button>
                                    </>
                                )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

};

export default DepartmentRooms;
