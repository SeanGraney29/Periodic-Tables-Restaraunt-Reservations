const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const validator = require("../util/validator");
const tabService = require("./tables.service");
const resService = require("../reservations/reservations.service");

//Checks if a tables exists in the database
async function tableExists(req, res, next) {
  const { tableId } = req.params;
  const table = await tabService.read(Number(tableId));
  res.locals.table = table;
 (table) ? next() : next({ status: 404, message: `Table ${tableId} cannot be found.` });
}

//Checks if the table has the required fields. Returns the apprproiate error message
function hasValidFields(req, res, next) {
  const { data = {} } = req.body;
  const invalid = validator(data, "table");
  (invalid.length) ? next({ status: 400, message: `Invalid table field(s): ${invalid}`}) : next();
}

//This send a reservation to be seated at a chosen table. Returns errors if not allowed.
async function seatTable(req, res, next) {
  if (!req.body.data || !req.body.data.reservation_id) next({ status: 400, message: `No reservation_id/data` });

  let { table } = res.locals;
  const reservation = await resService.read(req.body.data.reservation_id);
  
  if (!reservation) return next({ status: 404, message: `Reservation ${req.body.data.reservation_id} does not exist`});
  if (table.reservation_id !== null) return next({ status: 400, message: `Table occupied` });
  if (reservation.people > table.capacity) return next({ status: 400, message: `Table does not have the capacity` });
  if (reservation.status === ("seated" || "finished")) 
     return next({ status: 400, message: `Reservation already ${reservation.status}` });

  const newTable = await tabService.update({ ...table, ...req.body.data });
  if (newTable) await resService.update({ ...reservation, status: "seated" });

  res.json({ data: newTable });
}

//Lists all the tables
async function list(req, res, next) {
  res.json({ data: await tabService.list() });
}

//Make a new table
async function create(req, res) {
  res.status(201).json({ data: await tabService.create(req.body.data) });
}

//This removes a seated reservation from a table and opens the table so it can be assigned a different reservation
async function clearTable(req, res, next) {
  const { table } = res.locals;

  if (!table.reservation_id) return next({ status: 400, message: `Table not occupied` });

  const reservation = await resService.read(table.reservation_id);
  const newTable = await tabService.update({ ...table, reservation_id: null });
  if (newTable) await resService.update({ ...reservation, status: "finished" });

  res.json({ data: newTable });
}

//Shortcut variable for asyncErrorBoundary, helps me avoid sloppy typos
const aEB = asyncErrorBoundary
module.exports = {
  list: aEB(list),
  update: [aEB(tableExists), aEB(seatTable)],
  create: [aEB(hasValidFields), aEB(create)],
  clearTable: [aEB(tableExists), aEB(clearTable)],
};