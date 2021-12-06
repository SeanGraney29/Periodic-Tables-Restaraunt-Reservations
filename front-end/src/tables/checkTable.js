//This makes sure the new table fits the acdptable criteria.

export default function checkTable(formData, setErrors) {
    
  const errors = [];
    if (formData.table_name.length < 2) errors.push({ message: "Table_name must be more than one character" })
    if (formData.capacity < 1) errors.push({ message: "Capacity must be more than 0" });
    setErrors(errors);

    return (errors.length) ? false : true
}  