import React from "react";
import { Link } from "react-router-dom";
import { reservationStatus } from "../utils/api";

//Getting the information from Dashboard,
//This displays the relevant reservations, whether based on date or phone-number search.
//If no resevrations found, it displays exactly that "No reservations found"
//It also attaches buttons to each reservation to seat, edit or cancel.

export default function ResList({ reservations }) {

  //This is to handle the cancel the reservation. It's irreversible, so it displays a window confirmation.
  
  function handleCancel(reservation_id) {
    const abortController = new AbortController();
    let confirm = window.confirm( "\nDo you want to cancel this reservation?\n\n\nThis cannot be undone.");
    if (confirm) reservationStatus(reservation_id, "cancelled")
        .then(() => window.location.reload());
    return () => abortController.abort();
  }

  if (reservations.length) {

    return reservations.map((reservation) => {
      const { reservation_id, mobile_number, reservation_date, reservation_time, people, first_name, last_name, status } = reservation;
      let color = (status === "seated") ? "warning" : (status === "booked") ? "success" : "danger"

      return (
        <div className="col-lg-6 p-0" key={reservation_id}>
          <div className="card border-dark bg-light" id={reservation_id}>
            <div className="card-body p-2">
              <div className="text-center">
                <h5 className="d-inline-block card-title">{last_name},&nbsp;</h5>
                <h6 className="d-inline-block card-subtitle text-muted">
                {first_name}
                </h6>
              </div>
             
              <ul className="list-group">
                <li className="list-group-item">Contact: {mobile_number}</li>
                <li className="list-group-item">Party size: {people}</li>
                <li className="list-group-item">Date: {reservation_date}</li>
                <li className="list-group-item">Time: {reservation_time}</li>
                <li data-reservation-id-status={reservation.reservation_id} className="list-group-item">
                  Status:&nbsp;
                  <div className={`d-inline text-${color}`}>{status}</div>
                </li>
              </ul>
              {(status === "booked") ? (
              <div className="btn-toolbar justify-content-between" role="toolbar">

          <span className="border border-dark">
                   <div className="seat-button">
                     <Link to={`/reservations/${reservation_id}/seat`} className="btn" >
                    <b>Seat</b>
                     </Link>
                    </div>
                    </span>

                    <div className="btn-group">
                      
                   <div style={{ marginRight: 2 }} >
                     <Link to={`/reservations/${reservation_id}/edit`} className="btn btn-primary btn-sm"  >
                     <span className="oi oi-pencil"></span>
                     &nbsp;Edit
                      </Link>
                    </div>
                        <div className="btn-group-prepend">
                        <button
                          className="btn btn-danger btn-sm"
                          data-reservation-id-cancel={reservation.reservation_id}
                          onClick={(e) => { e.preventDefault(); handleCancel(reservation_id) }}
                       >
                          Cancel&nbsp;
                          <span className="oi oi-x"></span>
                        </button>

                  </div>
                </div>
              </div>) : <br></br>}
            </div>
          </div>
        </div>
      );
    });
  } else return <div className="text-center">&nbsp;No reservations found</div>;
}