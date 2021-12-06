import { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import checkTable from "./checkTable";


//This can add a new table to the table list.

export default function AddTable() {
  const [errors, setErrors] = useState([])
  const [formData, setFormData] = useState({ table_name: "", capacity: 0 });

  const history = useHistory();

  function handleSubmit(formData) {
    const abortController = new AbortController();
    if (checkTable(formData, setErrors))
      createTable(formData, abortController.signal)
        .then(setFormData({ table_name: "", capacity: 0 }))
        .then(() => window.location.assign(`/dashboard`))
        .catch(setErrors);
    return () => abortController.abort();
  };

  const errorList = (errors.length) ? 
  (errors.map((err, index) => 
    <ErrorAlert key={index} error={err} />
  )) : null

  return (
    <div>
      <h3>new table</h3>
      {errorList}
      <br></br>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData) }} >
        <div className="form-row">
          <div className="form-group col-md-6">
            <label className="form-label" htmlFor="table_name">
              Table name:&nbsp;
            </label>
            <input
              className="form-control"
              onChange={({ target }) => setFormData({ ...formData, table_name: target.value }) }
              id="table_name"
              name="table_name"
              value={formData.table_name}
              required={true}
            />
          </div>
          <div className="form-group col-med-6">
            <label className="form-label" htmlFor="capacity">
              Capacity:&nbsp;
            </label>
            <input
              type="number"
              onChange={({ target }) => setFormData({ ...formData, capacity: Number(target.value) })}
              min={1}
              placeholder={1}
              name="capacity"
              id="capacity"
              value={formData.capacity}
              required={true}
              className="form-control"
            />
          </div>
        </div>
        <br />
        <button className="btn btn-primary mr-1" type="submit">
          Submit
        </button>
        <button className="btn btn-danger" onClick={history.goBack}>
        <span className="oi oi-x"></span>
        &nbsp;Cancel
        </button>
      </form>
    </div>
  );
}