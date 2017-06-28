import React from 'react';
import ReactDOM from 'react-dom';

const TicketSubmission = ({submitTickets, ticketOptionList}) => (
  <div>
    <form className="form-horizontal">
      <div className="form-group">
        <div className="col-sm-10" id="ticket_submission_area">
          <textarea id="ticket_submission_description" className="form-control" placeholder="Ticket description"></textarea>
          <select className="form-control" id="ticket_option_dropdown">
            {ticketOptionList.map((option, index) => <option key={index}>{option}</option>)}
          </select>
          <button onClick={submitTickets} type="submit" id="ticket_submission_button" className="btn btn-default">Submit Ticket</button>
        </div>
      </div>
    </form>
  </div>
);

export default TicketSubmission;
