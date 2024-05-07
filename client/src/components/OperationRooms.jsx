import React from 'react'
import { useState, useEffect  } from 'react'
import httpResources from '../client/httpResources';
import ObjectDetails from './utils/ObjectDetails';
import bodyButton from './utils/bodyButton';
import formInput from './utils/formInput';
import { NavLink } from 'react-router-dom';
import ObjectsListing from './listing/ObjectsListing';

const OperationRooms = () => {
    const [operationRooms, setOperationRooms] = useState([]);
    const [editedOperationRooms, setEditedOperationRooms] = useState(null);

    useEffect(() => {
        const fetchOperationRooms = async () => {
          try{
            const response = await httpResources.get("get/operating_room/all");
            const foundOperationRooms = await response.data;
            setOperationRooms(foundOperationRooms);
          } catch(error){
          }
        }
        fetchOperationRooms();
    }, [])

  return (
    <ObjectsListing objectsData={operationRooms} objectKey={"ID_operating_room"} objectsTitle={"Operating Rooms"} objectLink={"/operating_rooms"}></ObjectsListing>
  )
}

export default OperationRooms
