import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import useQuery from "../utils/useQuery";
import { today } from "../utils/date-time";
import NotFound from "./NotFound";
import Dashboard from "../dashboard/Dashboard";
import Search from "../search/Search";
import AddTable from "../tables/AddTable";
import CreateRes from "../reservations/CreateRes";
import EditRes from "../reservations/EditRes";
import Seat from "../reservations/Seat";

//This the heavy lifting component.
//It gathers most of the data needed for the app inclyding the date, the reservations list and the table list.
//The sends it through other routes.

function Routes() {

  const [date, setDate] = useState("");
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  const history = useHistory();
  const query = useQuery();
  const location = useLocation();


  //This helps set the date. If a date is part of the query that the date is set for that date. 
  //However if there is no date query, it pushes today as the query, the automatically recyles through the useEffect
  //Then it sets the date based on the pushed query of today.
 useEffect(() => {
  if (location.pathname === "/dashboard")
  (query.get("date")) ? setDate(query.get("date")) : history.push(`/dashboard?date=${today()}`);
  }, [query, history, location]);

  //This calls functions from the api to list the reservations and tables.
  //It pulls the date from the state. If no date, it sits dormant until a date is set.
  
  useEffect(() => {
    function loadDash() {
      const abortController = new AbortController();
      setReservationsError(null);
      setTablesError(null);

      listReservations({ date }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);
      listTables(abortController.signal)
        .then(setTables)
        .catch(setTablesError);

      return () => abortController.abort();
    }
   if (date) loadDash();
  }, [date]);

  return (
    <div className="mt-5" >
    <Switch>
      
      <Route exact path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>

         <Route exact path="/reservations/:reservation_id/edit">
           <EditRes />
         </Route>

         <Route exact path="/reservations/:reservation_id/seat">
           <Seat tables={tables} reservations={reservations} setTables={setTables} setReservations={setReservations} />
         </Route>

             <Route exact path="/reservations/new">
                <CreateRes />
             </Route>

             <Route exact path="/search">
              <Search />
             </Route>

           <Route exact path="/tables/new">
           <AddTable />
           </Route>

         <Route path="/dashboard">
            <Dashboard
              date={date}
              reservations={reservations}
              tables={tables}
              reservationsError={reservationsError}
              tablesError={tablesError}
              setTablesError={setTablesError}
             />
          </Route>

        <Route>
        <NotFound />
      </Route>

    </Switch>
    </div>
  );
}

export default Routes;
  