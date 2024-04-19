import React from 'react';

const ReservationList = ({ reservations }) => {
  return (
    <ul>
      {reservations.map((reservation, index) => (
        <li key={index}>
          <span className="font-semibold">Reservation {index + 1}:</span>
          <ul>
            {Object.entries(reservation).map(([key, value]) => (
              <li key={key}>
                <span className="font-semibold">{key}: </span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default ReservationList;
