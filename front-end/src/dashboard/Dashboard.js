import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { next, today, previous } from "../utils/date-time";
import ResList from "./ResList";
import TableList from "./TableList";

//This displays the Dashboard, which includes:
// a date navigation bar, the reservation list based on the date and a list of tables.
//A lot of information is passed through here from the Routes.js file. Like relevant reservations, date, and tables

function Dashboard({ date, reservations, tables, reservationsError, tablesError, setTablesError }) {

  const history = useHistory();
  reservations = (reservations.filter((res) => res.status !== "cancelled"))

  return (
    <main>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <div className="row">
        <div className="col-md-8 col-sm-12" >
        <h2 >dashboard</h2>
        <br></br>
          <h4 className="mb-1 text-secondary">
            reservations for {date}</h4>
          <div className=" mb-1">
            <div
              className="btn-group btn-group"
              role="group"
              aria-label="Date Buttons"
            ></div>
           
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
            >
              <span className="oi oi-chevron-left" />
              &nbsp;Previous
            </button>
           
            <button
              type="button"
              className="btn btn-primary btn-lg active"
              onClick={() => history.push(`/dashboard?date=${today()}`)}
              style={{ margin: 2 }}
            >
              Today
            </button>
           
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => history.push(`/dashboard?date=${next(date)}`)}
            >
              Next &nbsp; <span className="oi oi-chevron-right" />
            </button>
          </div>
          
          <div className="row row-col-1 row-col-xl-2">
            <ResList reservations={reservations} />
          </div>
        
        </div>

        <div className="col-md-3  col-sm-12">
           <div className="mt-5" >
           <h3 className="mb-1 text-center">tables</h3>
            <TableList tables={tables} setTablesError={setTablesError} />
            </div>
        </div>
        </div>
    </main>
  );
}

export default Dashboard;