import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, seatResAtTable } from "../utils/api";

//This is a form that "seats" a reservation at a tabble and changes it's staus.
//You can pick from a scrolldown menu of all the tables that exist.

export default function Seat({ tables, setTables }) {

  const [formData, setFormData] = useState({ });
  const [currentRes, setCurrentRes] = useState({});
  const [error, setError] = useState(null);
  const { reservation_id } = useParams();
  const history = useHistory();

  //This sets the current reservation and the list of the tables with the current status information.
  useEffect(() => {
    const abortController = new AbortController();
    readReservation(reservation_id)
      .then(setCurrentRes)
      .catch(setError);
    listTables()
      .then(setTables)
      .catch(setError);
    return abortController.abort();
  }, [reservation_id, setTables]);

// It uses the seatResAtTable from api to do the back-end details.
 function handleSubmit() {
    const abortController = new AbortController();
      seatResAtTable(formData.table_id, reservation_id)
       .then(() => history.push(`/dashboard?date=${currentRes.reservation_date}`))
       .then(() => window.location.reload())
        .catch(setError);
    return () => abortController.abort();
  };

const handleChange = ({ target }) => { setFormData({ ...formData, [target.name]: target.value }) };

const tableMenu = (tables) ? tables.map((table) => 
          <option name={table.table_id} value={table.table_id} key={table.table_id} >
                {table.table_name} - {table.capacity}
              </option>
            ) : <option>No tables available</option>

  return (
    <div>
      <h2>Seat Reservation</h2>
      <ErrorAlert error={error} />
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit()}} >
        <label className="form-label" htmlFor="table_id">
          Select Table:&nbsp;
        </label>
        <select className="form-select" name="table_id" onChange={handleChange}>
          <option defaultValue={0}>Please choose table:</option>
         {tableMenu}
        </select>
        <button className="btn btn-primary ml-1" type="submit">
          Submit
        </button>
        <button
          className="btn btn-danger ml-1"
          onClick={(e) => { e.preventDefault(); history.goBack();}}
        >
           <span className="oi oi-x"></span>
          &nbsp;Cancel
        </button>
      </form>
    </div>
  );
}