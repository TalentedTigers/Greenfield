import React from 'react';
import ReactDOM from 'react-dom';
import util from '../helpers/util';

const TicketEntry = ({user, ticket, updateTickets, hasClaimed}) => {

  let claimButton = null;
  let closeButton = null;
  let className = null;
  let time = null;

  if (ticket.status === 'Opened') {
    className = 'alert-success';
    time = `opened ${util.timefromNow(ticket.createdAt)}`;
  } else if (ticket.status === 'Claimed') {
    className = 'alert-info';
    time = `claimed ${util.timefromNow(ticket.claimedAt)}`;
  } else {
    className = 'alert-danger';
    time = `closed ${util.timefromNow(ticket.closedAt)}`;
  }

  if (ticket.status === 'Opened' && ticket.userId !== user.id) {
    claimButton = <button onClick={() => updateTickets({ id: ticket.id, status: 'Claimed' })} type="button" className="btn btn-xs btn-primary" disabled={hasClaimed}>Claim</button>;
  }

  if (ticket.status !== 'Closed' && (ticket.claimedBy === user.id || ticket.userId === user.id)) {
    closeButton = <button onClick={() => updateTickets({ id: ticket.id, status: 'Closed' })} type="button" className="btn btn-xs btn-danger">Close</button>;
  }

  return (
    <div className={`ticket_list_entry alert ${className} clearfix`}>
      <div className="ticket_list_entry_meta clearfix">
        <div className="ticket_list_entry_name">{ticket.user.firstName} {ticket.user.lastName} ({ticket.location})</div>
        <div className="ticket_list_entry_time">- {time}</div>
      </div>
      <div className="ticket_list_entry_buttons">
        <span className="btn btn-xs btn-default">{ticket.category}</span>
        {claimButton}
        {closeButton}
      </div>
      <div className="ticket_list_entry_description">
        {ticket.description}
      </div>
    </div>
  );
};

export default TicketEntry;
