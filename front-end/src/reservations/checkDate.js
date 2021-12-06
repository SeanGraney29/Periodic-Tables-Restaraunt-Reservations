
//This functions checks to make sure the date falls within the reuired parameters.
//It returns the appropriate error if the date is not valid.

export default function checkDate(formData, setDateErrors) {

  const today = new Date();

  const resDate = new Date(`${formData.reservation_date} ${formData.reservation_time} GMT-0500`),
      start = new Date(`${formData.reservation_date} 10:30:00 GMT-0500`),
      end = new Date(`${formData.reservation_date} 21:30:00 GMT-0500`);

    const errors = [];
    const top = "Reservations cannot be made"
  
    if (resDate.getDay() === 2) errors.push({ message: `${top} on a Tuesday (Restaurant is closed).`});
    if (resDate < today) errors.push({ message: `${top} in the past.` });
    if ( resDate.getTime() < start.getTime() || resDate.getTime() > end.getTime() )
      errors.push({ message: `${top} outside of 10:30am to 9:30pm.` });
    setDateErrors(errors);

    return (errors.length) ? false : true
  }