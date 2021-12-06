import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { readReservation, updateReservation } from "../utils/api";
import formatReservationTime from "../utils/format-reservation-time";
import SharedResForm from "./SharedResForm";
import checkDate from "./checkDate";
import ErrorAlert from "../layout/ErrorAlert";


//This displays the page that edist an existing reservation.
//It shares the reservation form with the CreateRes file.
//It populates the form with the existing reservation

export default function EditRes() {
  const [reservation, setReservation] = useState({});
  const [errorAlerts, setErrorAlerts] = useState([]);

  const { reservation_id } = useParams();

  //This sets the current reservation based on the ID in the parameters
  useEffect(() => {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setErrorAlerts);
    return () => abortController.abort();
  }, [reservation_id]);

  //This submits a updated reservation into the data base. It has a window confirmation.
  //To refresh with the current data, I used "window.location.assign" because with "history.push" the reservation list wasn't updating quickly enough,
  //So it would push the new date without the current reservation being included in the list.
  //I tried to use window.location.reload() but a lot of the tests wouldn't pass.

  async function handleSubmit(updatedRes) {
    const abortController = new AbortController();
    if (checkDate(updatedRes, setErrorAlerts)) {
      await updateReservation(formatReservationTime(updatedRes), abortController.signal)
      .then(() => window.location.assign(`/dashboard?date=${updatedRes.reservation_date}`))
      .catch((e) => { setErrorAlerts(e) });
      return () => abortController.abort();
    }
  }

    //This displays each error indivdually
  const errors = (errorAlerts.length) 
      ? errorAlerts.map((error, index) => {
        return (<div key={index}> <ErrorAlert error={error} /> </div>)
    }) : null 

    //This sends the information to the shared reservation form unless there is no ID
  const filledResForm = (reservation.reservation_id)
  ? (<SharedResForm initialState={{ ...reservation }} handleSubmit={handleSubmit}/>) 
  : ( <p>Loading...</p>);

  return (
    <main>
      <h3 >edit reservation</h3>
      {errors}
      <br></br>
      {filledResForm}
    </main>
  );
}