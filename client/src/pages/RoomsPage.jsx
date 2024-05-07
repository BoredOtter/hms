import React from 'react'
import { useState, useEffect } from 'react';
import httpResources from '../client/httpResources';
import ObjectsListing from '../components/listing/ObjectsListing';

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try{
                const response = await httpResources.get(`/get/room/all`);
                const foundRooms = response.data;
                setRooms(foundRooms);
            }catch(error){}
            finally{
                setLoading(false);
            }
        }
        fetchRooms();
    }, [])
  return (
    <ObjectsListing objectsData={rooms} objectKey={"ID_room"} objectsTitle={"Rooms"} objectLink={"/rooms"}>

    </ObjectsListing>
  )
}

export default RoomsPage
