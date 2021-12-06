const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const resService = require("./reservations.service");
const validator = require("../util/validator");

//Shortcut variable to log the word "Reservation" in error messages, helps me avoid sloppy typos
const r = "Reservation"

//Checks if the reservation exists
async function resExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await resService.read(reservationId);
   res.locals.reservation = reservation;
  return (reservation) ? next() : 
    next({ status: 404, message: `${r} ${reservationId} cannot be found.` });
}

//Checks if the reservation has the valid field/parameters. Return appropriate error
function hasValidFields(req, res, next) {
  const { data = {} } = req.body;
  const invalid = validator(data, r);
  const dRD = data.reservation_date

  const resDate = new Date(`${dRD} ${data.reservation_time} GMT-0500`),
     start = new Date(`${dRD} 10:30:00 GMT-0500`),
     end = new Date(`${dRD} 21:30:00 GMT-0500`);

  if (invalid.length) return next({ status: 400, message: `Invalid reservation field(s): ${invalid}`});
  if (resDate.getDay() === 2) return next({ status: 400, message: `${r}s cannot be made on a Tuesday (Restaurant is closed).` });
  if (resDate < new Date()) return next({ status: 400, message: `${r}s must be made in the future.` });
  if ( resDate.getTime() < start.getTime() || resDate.getTime() > end.getTime()) 
      return next({ status: 400, message: `${r}s cannot be made outside of 10:30am to 9:30pm.` });
  if (data.status && data.status !== "booked") return next({ status: 400, message: `Status cannot be ${data.status}` });

  next();
}

//List the reservations either by date or by the phone-number search
async function list(req, res) {
  const resDate = req.query.date;
  const data = resDate
    ? await resService.listByDate(resDate)
    : await resService.search(req.query.mobile_number);

  res.json({ data });
}

//Put in a new reservation
async function create(req, res) {
  res.status(201).json({ data: await resService.create(req.body.data) });
}

//Read a single reservation
async function read(req, res) {
  res.json({ data: await res.locals.reservation });
}

//This changes the status of reservation and sends the apprpriate error if needed
async function updateStatus(req, res, next) {
  const { data: { status } } = req.body;
  const { reservation } = res.locals;
  const statusArr = ["booked", "seated", "finished", "cancelled"]

  if (reservation.status === "finished") 
      return next({ status: 400, message: `A finished reservation cannot be updated` });
  
  if (!statusArr.includes(status)) 
      return next({ status: 400, message: `Status cannot be ${status}` });

  res.status(200).json({ data: await resService.update({ ...reservation, status: status }) });
}

//Update an existsing reservation
async function update(req, res) {
  const { data } = req.body;
  const { reservation } = res.locals;

  res.status(200).json({ data: await resService.update({ ...reservation, ...data }) });
}

//Shortcut variable for asyncErrorBoundary, helps me avoid sloppy typos
const aEB = asyncErrorBoundary
module.exports = {
  list: aEB(list),
  create: [aEB(hasValidFields), aEB(create)],
  read: [aEB(resExists), aEB(read)],
  updateStatus: [aEB(resExists), aEB(updateStatus)],
  update: [aEB(hasValidFields), aEB(resExists), aEB(update)],
};
