const knex = require("../db/connection");

//I use a very short variable to help me avoid typos.
const r = "reservations"

//Lists all the reservations
function list() {
  return knex(r).orderBy("reservation_date", "reservation_time");
}

//Lists all the reservations on a given date
function listByDate(reservation_date) {
  return knex(r)
    .where({ reservation_date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

//Put in a new reservation
function create(reservation) {
  return knex(r).insert(reservation, "*").then((created) => created[0]);
}

//Read a specific reservation by a given date
function read(reservation_id) {
  return knex(r).where({ reservation_id }).first();
}

//Update an existing reservation by ID
function update(updatedRes) {
  return knex(r)
    .where({ reservation_id: updatedRes.reservation_id })
    .update(updatedRes, "*")
    .then((updated) => updated[0]);
}

//Search for a reservation by mobile number
function search(mobile_number) {
  return (mobile_number) ? 
  knex(r)
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date") 
    : null
}

module.exports = {
  list,
  listByDate,
  create,
  read,
  update,
  search,
};