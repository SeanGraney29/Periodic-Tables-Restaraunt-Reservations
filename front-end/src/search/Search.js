import { useState } from "react";
import { useHistory } from "react-router-dom";
import ResList from "../dashboard/ResList";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import phoneNumConvert from "../utils/phone-number";


//This finds reservations based on a mobile number, either partial or complete.
//Then it displays all the reservations associated with that number, even if they are in the past.
//It uses a helper function called phoneNumConver that converts the data entered into the acceptable format.

export default function Search() {
  const [error, setError] = useState(null);
  const [findNum, setFindNum] = useState({ mobile_number: "" });
  const [reservations, setReservations] = useState(null);

  const history = useHistory();

 function handleFind() {
    setReservations([]);
    const abortController = new AbortController();
    const { mobile_number } = findNum;

    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .catch(setError);

    return () => abortController.abort();
  };

  return (
    <div>
      <h3>search</h3>
      <ErrorAlert error={error} />
      <br></br>

      <form onSubmit={(e) => { e.preventDefault(); handleFind()}}>
        <label className="form-label" htmlFor="mobile_number">
          Mobile number:&nbsp;
        </label>
              <input
                type="tel"
                onChange={({ target }) => setFindNum({ mobile_number: target.value })}
                id="mobile_number"
                name="mobile_number"
                value={phoneNumConvert(findNum.mobile_number)}
                placeholder="Enter a customer's phone number"
                size={30}
                maxLength={12}
                required={true}
              />
              &nbsp;
             
              <button className="btn btn-primary " type="submit" style={{ marginRight: 2 }}>
              <span className="oi oi-eye"></span> &nbsp;Find
              </button>
              <button
                className="btn btn-danger"
                onClick={(e) => { e.preventDefault(); history.goBack() }}
                       >
                          Cancel&nbsp;
                          <span className="oi oi-x"></span>
                        </button>
                        
            </form>
            <br></br>
       
          
      <div className="row row-col-1 row-col-xl-2" >
         {(reservations) ? <ResList reservations={reservations} /> : null}
      </div>
    </div>
  );
}