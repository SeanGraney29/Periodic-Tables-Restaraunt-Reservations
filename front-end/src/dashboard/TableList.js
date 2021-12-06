import { clearTable } from "../utils/api";


//Getting the information from Dashboard,
//This displays all the tables, if no tables are found, it displays "No tables" (which it's almost impossible to have no tables)
//It also shows whether the table is occupied or not.
//If occupied it attaches a finsih button to clear the table for a new reservation

export default function TableList({ tables, setTablesError }) {

  //Because clearing a tabel is irreversible and list the reservation as finished.
  //There is a window confirmation attached to this.
  
  const handleClearTable = (table_id) => {
    const abortController = new AbortController();
    let confirm = window.confirm( "\nIs this table ready to seat new guests?\n\nThis cannot be undone.");
    if (confirm) clearTable(table_id)
        .then(() => window.location.reload())
        .catch(setTablesError);
    return () => abortController.abort();
  };

  if (tables.length) {
    return tables.map((table) => {
      return (
        <div className="col d-flex justify-content-center" key={table.table_id}>
        <div className="col-lg-6 p-0" >
          <div className="card border-dark" id={table.table_id} name={table.table_id} >
          <div className="table-sidebar">
            <div className="card-body p-2">
              <h6 className="card-title text-center">{table.table_name}</h6>
              <div className="row row-col-2 justify-content-between m-1">
                <p data-table-id-status={table.table_id} className={ table.reservation_id ? "text-danger" : "text-success" } >
                  {table.reservation_id ? "Occupied" : "Free"}
                </p>
                {(table.reservation_id) ? 
                ( <div>
                  <button
                  type="submit"
                  data-table-id-finish={table.table_id}
                  className="btn btn-sm btn-primary"
                  onClick={(e) => { e.preventDefault(); handleClearTable(table.table_id) }}
                >
                  Finish
                </button>
                </div>
                ) : null}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  } else return <div>No Tables</div>;
}