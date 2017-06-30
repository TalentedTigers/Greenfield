import React from 'react';
import ReactDOM from 'react-dom';

const TicketSubmission = ({submitTickets, ticketCategoryList}) => (
  <form className="ticket_submission_form">
    <div className="form-group row">
      <div className="col-xs-12"><h2>Create a ticket</h2></div>
    </div>
    <div className="form-group row">
      <div className="col-xs-4">
        <label htmlFor="ticket_submission_category">Category</label>
        <select className="form-control" id="ticket_submission_category">
          {ticketCategoryList.map((category, index) => <option key={index}>{category}</option>)}
        </select>
      </div>
      <div className="col-xs-4">
        <label htmlFor="ticket_submission_location">Location</label>
        <input type="text" id="ticket_submission_location" className="form-control" placeholder="Your station number" required />
      </div>
    </div>
    <div className="row">
      <div className="col-xs-10">
        <textarea id="ticket_submission_description" className="form-control" placeholder="Ticket description"></textarea>
      </div>
      <div className="col-xs-2">
        <button onClick={submitTickets} type="submit" id="ticket_submission_button" className="btn btn-primary">Submit Ticket</button>
      </div>
    </div>
  </form>
);

export default TicketSubmission;
