import React from 'react'
import formInput from '../utils/formInput'
import { useState, useEffect } from 'react';
import bodyButton from '../utils/bodyButton'
import httpResources from '../../client/httpResources';
import ObjectDetails from '../utils/ObjectDetails';
import formLabel from '../utils/formLabel';
import SearchBar from '../SearchBar';
import currentDate from '../utils/currentDate';

const OperatingRoomReservations = ({ID_operating_room}) => {

    const [searchTerm,setSearchTerm] = useState('');
    const [procedures, setProcedures] = useState([]);
    const [selectedProcedure, setSelectedProcedure] = useState('')
    const [refreshing, setRefreshing] = useState(false);
    const [reservation, setReservation] = useState({
        ID_operating_room: parseInt(ID_operating_room),
        Reservation_date: currentDate,
        Start_time: '',
        End_time: '',
        ID_procedure: ''
      });

    useEffect(() => {
      const fetchProcedures = async () => {
        try{
          const response = await httpResources.get('/get/medical_procedure/all');
          const foundProcedures = response.data;
          setProcedures(foundProcedures);
        }catch(error){}
      }
      fetchProcedures();
    }, [refreshing])

    const filteredProcedures = procedures.filter(procedure => {
      const search = searchTerm.toLowerCase();
      return procedure.Procedure_name.toLowerCase().includes(search);
    });

      const handleInputChange = (event) => {
          event.preventDefault();

          const { name, value } = event.target;
          setReservation((values) => ({
              ...values,
              [name]: value
          }));
      };

    const handleAddReservation = async () => {
      if (!reservation.Start_time || !reservation.End_time || !reservation.ID_procedure) {
          alert("Please fill in all fields.");
          return;
      }
        try{
            await httpResources.post("/create/operating_room_reservation", reservation)
            setReservation({
                ID_operating_room: ID_operating_room,
                Reservation_date: '',
                Start_time: '',
                ID_procedure: ''
              })
              setRefreshing(!refreshing);
            alert("Reservation added successfully!")
        }catch(error){
            alert(error.response.data.detail)
        }
    }
    
    const handleAddProcedure = (procedure) => {
      setSelectedProcedure(procedure);
      setReservation(prevReservation => ({
          ...prevReservation,
          ID_procedure: parseInt(procedure.ID_procedure)
      }));
    };

    const handleDeleteProcedure = (ID_procedure) => {
      setSelectedProcedure('')
    };
  
  return (
    <>
      <ObjectDetails title={"Operating Room Reservation"}>
        <form className='mt-2 space-y-2'>
            <label className={formLabel}>Reservation Date</label>
            <input 
              className={formInput} 
              type="date" 
              name="Reservation_date" 
              value={reservation.Reservation_date}
              onChange={handleInputChange}
            />
            <label className={formLabel}>Start Time</label>
            <input 
              className={formInput} 
              type="time" 
              name="Start_time" 
              value={reservation.Start_time}
              onChange={handleInputChange}
            />
            <label className={formLabel}>End Time</label>
            <input 
              className={formInput} 
              type="time" 
              name="End_time" 
              value={reservation.End_time}
              onChange={handleInputChange}
              />
        </form>
        <label className={formLabel}>Search Procedure:</label>
        <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
        {searchTerm !== '' && 
            <div className='grid grid-cols-1 gap-2'> 
            {filteredProcedures.map(procedure => (
              <button key={procedure.ID_procedure} className="bg-[#2D9596] p-4 rounded-md mt-4 text-center justify-center items-center" onClick={() => handleAddProcedure(procedure)}>
                <h4 className="text-white">{procedure.Procedure_name}</h4>
              </button>
            ))}
            </div>
        }
        <div className='mt-5 '>
            <h3>Selected Procedure:</h3>
            <span className="font-bold text-xl mt-1" style={{ color: "black" }}>
                {selectedProcedure.Procedure_name}
            </span>
            <button onClick={() => handleDeleteProcedure(selectedProcedure)} className={`${bodyButton} ml-2`}>
                Delete
            </button>
        </div>
        <button className={`${bodyButton} mt-2`} onClick={handleAddReservation}>Add Reservation</button>

      </ObjectDetails>
    </>
    
  )
}

export default OperatingRoomReservations
