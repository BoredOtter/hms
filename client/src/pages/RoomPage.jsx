import React, { useState } from 'react'
import { useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import httpResources from '../client/httpResources';
import ObjectDetails from '../components/utils/ObjectDetails';
import WarningInfo from './WarningInfo';
import bodyButton from '../components/utils/bodyButton';
import ObjectSlicer from '../components/utils/ObjectSlicer';
import formInput from '../components/utils/formInput';
import formLabel from '../components/utils/formLabel';
import currentDate from '../components/utils/currentDate';

const RoomPage = () => {
    const{id} = useParams();
    const params = { room_id: id };
    const [bedReservations, setBedReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [newEndDate, setNewEndDate] = useState('');
    const [editedReservation, setEditedReservation] = useState(null);


    useEffect(() => {
        const fetchBedReservations = async () => {
            try{
                const response = await httpResources.get(`/get/bed_reservation/`, {params});
                const foundBedReservations = response.data;
                setBedReservations(foundBedReservations);
            }catch(error){}
            finally{
                setLoading(false);
            }
        }
        fetchBedReservations();
    }, [])

    const handleDeleteReservation = async (ID_patient) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this reservation?");
        if (confirmDelete) {
            try {
                await httpResources.delete(`/delete/bed_reservation/${ID_patient}`);
                alert("Bed reservation successfully deleted!");
                setBedReservations(prevReservations => prevReservations.filter(reservation => reservation.ID_patient !== ID_patient));
            } catch (error) {
                alert(error.response.data.detail);
            }
        }
    }

    const handleEditEndDate = (bedReservation) => {
        setEditMode(true);
        setNewEndDate(bedReservation.End_date);
        setEditedReservation(bedReservation);
    };

    const handleCancelEdit = () => {
            setEditMode(false);
            setEditedReservation(null);
        };
    
    const handleSaveEndDate = async (reservationId, start_date) => {
        try {
            await httpResources.patch(`/update/bed_reservation_time/${reservationId}`, {
                Start_date: start_date,
                End_date: newEndDate 
            });
            alert("End date updated successfully!");
            setBedReservations(prevReservations => {
                return prevReservations.map(reservation => {
                    if (reservation.ID_reservation === reservationId) {
                        return { ...reservation, End_date: newEndDate };
                    }
                    return reservation;
                });
            });
        } catch (error) {
            alert(error.response.data.detail);
        }
        setEditMode(false);
        setEditedReservation(null);
    };
        


  return (
    loading ? <WarningInfo loading={true} /> :
    <div className='justify-center text-center'>
        <h1 className='text-3xl font-bold mb-2 mt-4'>Bed Reservations</h1>
        <div className="grid sm:grid-cols-2 ">
        {
            bedReservations.map(bedReservation => {
                return (
                <ObjectDetails key={bedReservation.ID_reservation}>
                    <ObjectSlicer object={bedReservation}></ObjectSlicer>
                    {editMode ? (
                                <>
                                <p className={formLabel}>Select new End Date:</p>
                                <input 
                                    className={`${formInput} mb-2`} 
                                    type="date" 
                                    value={newEndDate} 
                                    onChange={(e) => setNewEndDate(e.target.value)} 
                                />
                                    <div className='space-x-2'>
                                        <button className={bodyButton} onClick={() => handleSaveEndDate(parseInt(bedReservation.ID_reservation), bedReservation.Start_date)}>Save</button>
                                        <button className={bodyButton} onClick={handleCancelEdit}>Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <div className='space-x-2'>
                                    <button className={bodyButton} onClick={handleEditEndDate}>Edit</button>
                                    <button className={bodyButton} onClick={() => handleDeleteReservation(bedReservation.ID_patient)}>Delete </button>
                                    <NavLink to={`/patients/${bedReservation.ID_patient}`} className={`${bodyButton} pt-3`}>Check Patient</NavLink>
                                </div>
                            )}
                </ObjectDetails>
                )
            })
        }
        </div>
    </div>
  )
}

export default RoomPage
