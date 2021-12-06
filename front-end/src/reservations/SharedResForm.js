import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import phoneNumConvert from "../utils/phone-number";

//This is a form that is used by Create and Edit Reservations.
//It processes the information, makes sure it a valiud according the parameters of the field, and return approiate errors.

export default function SharedResForm({ handleSubmit, initialState }) {

  const [formData, setFormData] = useState(initialState);
  const history = useHistory();

  //This switch is used to make sure the mobile number and capacity is the correct format. 
  //I like switches!! I wish I could use them more.

  let handleChange = ({ target, values }) => {
    switch (target.name) {
      case "people":
        values = Number(target.value); break;
      case "mobile_number":
        values = phoneNumConvert(target.value); break;
      default:
        values = target.value; break;
    }
    setFormData({ ...formData, [target.name]: values });
  };

  return (
    <div>
      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit(formData) }} >
        <div className="form-row">
          <div className="form-group col-md-6">
            <label className="form-label" htmlFor="first_name">
              First name:&nbsp;
            </label>
           
                      <input
                        className="form-control border-secondary"
                        onChange={handleChange}
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        placeholder={(formData.first_name) ? formData.first_name : "Your First Name" }
                        required={true}
                      />
                    </div>
              
                            <div className="form-group col-md-6">
                              <label className="form-label" htmlFor="last_name">
                                Last name:&nbsp;
                              </label>
                              <input
                                className="form-control border-secondary"
                                onChange={handleChange}
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                placeholder={(formData.last_name) ? formData.last_name : "Your Last Name" }
                                required={true}
                              />
                            </div>
                          </div>
                        
                                <div className="form-row">
                                  <div className="form-group col-md-6">
                                    <label className="form-label" htmlFor="mobile_number">
                                      Mobile number:&nbsp;
                                    </label>
                                  
                                    <input
                                      className="form-control border-secondary"
                                      type="tel"
                                      onChange={handleChange}
                                      name="mobile_number"
                                      id="mobile_number"
                                      value={formData.mobile_number}
                                      placeholder={formData.mobile_number}
                                      pattern="([0-9]{3}-)?[0-9]{3}-[0-9]{4}"
                                      required={true}
                                    />
                                  </div>
                            
                                    <div className="form-group col-md-6">
                                      <label className="form-label" htmlFor="reservation_date">
                                        Date of reservation:&nbsp;
                                      </label>
                                    
                                      <input
                                        className="form-control border-secondary"
                                        onChange={handleChange}
                                        type="date"
                                        pattern="\d{4}-\d{2}-\d{2}"
                                        name="reservation_date"
                                        id="reservation_date"
                                        value={formData.reservation_date}
                                        placeholder={formData.reservation_date}
                                        required={true}
                                      />
                                    </div>
                                  </div>
                        
                            <div className="form-row">
                              <div className="form-group col-md-6">
                                <label className="form-label" htmlFor="reservation_time">
                                  Time of reservation:&nbsp;
                                </label>
                                
                            <input
                              className="form-control border-secondary"
                              type="time"
                              pattern="[0-9]{2}:[0-9]{2}"
                              onChange={handleChange}
                              name="reservation_time"
                              id="reservation_time" 
                              value={formData.reservation_time}
                              placeholder={formData.reservation_time}
                              required={true}
                            />
                          </div>
            
                  <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="people">
                      Number of people in party:&nbsp;
                    </label>
                    <input
                      className="form-control border-secondary"
                      onChange={handleChange}
                      type="number"
                      min={1}
                      name="people"
                      id="people"
                      value={formData.people}
                      placeholder={formData.people}
                      required={true}
                    />
                  </div>
                </div>
       
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
        
        <button
          className="btn btn-danger ml-1"
          onClick={(e) => { e.preventDefault(); history.goBack() }}
          type="cancel"
        >
          <span className="oi oi-x"></span>
          &nbsp;Cancel
        </button>
      </form>
    </div>
  );
}


