import React, { useState, useEffect } from 'react';
import httpResources from '../../client/httpResources';
import ObjectDetails from '../utils/ObjectDetails';
import bodyButton from '../utils/bodyButton';
import SearchBar from '../SearchBar';
import currentDate from '../utils/currentDate';
import formInput from '../utils/formInput';
import formLabel from '../utils/formLabel';

const PatientBedReservationCreation = ({ patient_id , refresh}) => {
    const [rooms, setRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [endDate, setEndDate] = useState(currentDate)

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await httpResources.get(`/get/room/all`);
                const foundRooms = response.data;
                setRooms(foundRooms);
            } catch (error) {
            }
        };
        fetchRooms();
    }, []);

    const filteredRooms = searchTerm
    ? rooms.filter(room => room.ID_department === parseInt(searchTerm))
    : rooms;
  
    const handleBedReservation = async (room) => {
        try {
            await httpResources.post("/create/bed_reservation", {
                ID_patient: `${patient_id}`,
                ID_room: `${room.ID_room}`,
                Start_date: currentDate,
                End_date: endDate
            });
            refresh();
            alert("Bed reserved successfully!");
        } catch (error) {
            alert(error.response.data.detail);
        }
    };

    const handleEndDateChange = (e) => {
        const selectedDate = e.target.value;
        if (selectedDate < currentDate) {
            setEndDate(currentDate);
        } else {
            setEndDate(selectedDate);
        }
    };

    return (
        <>
            <div className='bg-sky-100 p-10 m-5 shadow rounded'>
                <h1 className='text-3xl font-bold mb-3 text-center'>Create Bed Reservation</h1>
                <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
                <p className={formLabel}>End Date:</p>
                <input
                className={`${formInput}`}
                type="date"
                value={endDate}
                onChange={handleEndDateChange}/>
                {searchTerm !== '' &&
                    <div className='grid sm:grid-cols-3 gap-4 grid-cols-1'>
                        {filteredRooms.map(room => (
                            <ObjectDetails key={room.ID_room} title={`Room ${room.ID_room}`}>
                                <p>Beds quantity: {room.Number_of_beds}</p>
                                <button className={bodyButton} onClick={() => handleBedReservation(room)}>Reserve</button>
                            </ObjectDetails>
                        ))}
                    </div>
                }
            </div>
        </>
    );
};

export default PatientBedReservationCreation;
