import React from 'react'
import formInput from '../utils/formInput'

const OperatingRoomReservations = ({ID_operating_room}) => {

    const [isReservationsMode, setIsReservationsMode] = useState(false);
    const [reservation, setReservation] = useState({
        "ID_operating_room": ID_operating_room,
        "Reservation_date": '',
        "Start_time": '',
        "End_time": ''
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
        try{
            await httpResources.post("/create/operating_room_reservation", reservation)
            setReservation({
                "ID_operating_room": ID_operating_room,
                "Reservation_date": '',
                "Start_time": '',
                "End_time": ''
              })
            alert("Reservation added successfully!")
        }catch(error){
            alert(error.response.data.detail)
        }
    }
  return (
    <form className='mt-2 space-y-2'>
        <input className={formInput} type="date" name="Reservation_date" value={reservation.Reservation_date}></input>
        <input className={formInput} type="time" name="Start_time" value={reservation.Start_time}></input>
        <input className={formInput} type="time" name="End_time" value={reservation.End_time}></input>
        <button className={`${bodyButton} mt-2`} onClick={handleAddReservation}>Add</button>
    </form>
  )
}

export default OperatingRoomReservations
