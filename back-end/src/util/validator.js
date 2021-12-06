
//This checks whether the table being created fits within the required parameters, then returns an approrpriate error.
module.exports = function validator(input, item) {
    const invalidFields = [];

    if (item === "table") {
        const table = input
        if ( typeof table.capacity !== "number" || table.capacity < 1 ) invalidFields.push("capacity");
        if (!table.table_name || table.table_name.length < 2) invalidFields.push("table_name");
    } else {
        const { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = input;
        const reservation = { first_name, last_name, mobile_number, reservation_date, reservation_time, people }

    for (const field in reservation) if (!reservation[field]) invalidFields.push(field);
    
    if (typeof reservation.people !== "number" || reservation.people < 1) invalidFields.push("people");
    if (!/^\d{2}:\d{2}$/.test(reservation.reservation_time)) invalidFields.push("reservation_time");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(reservation.reservation_date)) invalidFields.push("reservation_date");
}
    return invalidFields.join(", ");
  }