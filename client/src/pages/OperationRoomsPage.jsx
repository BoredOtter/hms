import React from 'react'
import { useState, useEffect  } from 'react'
import httpResources from '../client/httpResources';
import ObjectsListing from '../components/listing/ObjectsListing';

const OperationRoomsPage = () => {
    const [operationRooms, setOperationRooms] = useState([]);

    useEffect(() => {
        const fetchOperationRooms = async () => {
          try{
            const response = await httpResources.get("get/operating_room/all");
            const foundOperationRooms = await response.data;
            setOperationRooms(foundOperationRooms);
          } catch(error){
            alert(error.response.data.detail);
          }
        }
        fetchOperationRooms();
    }, [])

  return (
    <ObjectsListing objectsData={operationRooms} objectKey={"ID_operating_room"} objectsTitle={"Operating Rooms"} objectLink={"/operating_rooms"}></ObjectsListing>
  )
}

export default OperationRoomsPage
