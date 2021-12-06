import { useState } from "react";
import { createReservation } from "../utils/api";
import { today } from "../utils/date-time";
import SharedResForm from "./SharedResForm";
import checkDate from "./checkDate";
import ErrorAlert from "../layout/ErrorAlert";


//This displays the page that creates a new reservation.
//It shares the reservation form with the EditRes file.
//It populates the form with an intial state that quickly helps the user to know how to fill out the form.

export default function CreateRes() {
  const [errorAlerts, setErrorAlerts] = useState([]);

  //This submits a new reservation into the data base. It has a window confirmation.
  //To refresh with the current data, I used "window.location.assign" because with "history.push" the reservation list wasn't updating quickly enough,
  //So it would push the new date without the current reservation being included in the list.
  //I tried to use window.location.reload() but a lot of the tests wouldn't pass.

  function handleSubmit (reservation) {
    const abortController = new AbortController();
    setErrorAlerts([]);
   if (checkDate(reservation, setErrorAlerts)) {
      createReservation(reservation, abortController.signal)
      .then(() => window.location.assign(`/dashboard?date=${reservation.reservation_date}`))
        .catch(setErrorAlerts);
    }
    return () => abortController.abort();
  };

  //This displays each error indivdually
  const errors = (errorAlerts.length) 
  ? errorAlerts.map((error, index) => {
    return (<div key={index}>
      <ErrorAlert error={error} />
    </div>)
}) : null 

const initialFormState = { 
  first_name: "", 
  last_name: "",  
  mobile_number: "xxx-xxx-xxxx", 
  reservation_date: today(), 
  reservation_time: "19:00", 
  people: "# in your party" 
}

    return (
    <main>
      <h3 >create reservation</h3>
      {errors}
      <br></br>
      <SharedResForm handleSubmit={handleSubmit} initialState={initialFormState}/>
    </main>
  );
}