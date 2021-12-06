const knex = require("../db/connection");
const t = "tables"

//Calls a table based on an ID
function read(table_id) {
  return knex(t)
    .where({ table_id })
    .first();
}

//Lists all the tables
function list() {
  return knex(t)
    .orderBy("table_name");
}

//Update an existing table, which for this app can only be used to seat and unseat reservations
function update(updatedTable) {
  return knex(t)
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updated) => updated[0]);
}

//Makes a new table
function create(table) {
  return knex(t)
    .insert(table, "*")
    .then((created) => created[0]);
}

module.exports = { read, list, update, create };