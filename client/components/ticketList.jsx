import React from 'react';
import ReactDOM from 'react-dom';
import TicketEntry from './ticketEntry.jsx';

const TicketList = ({user, ticketList, updateTickets}) => (
  <div className="ticket_list">
    {ticketList.map((ticket, index) => <TicketEntry user={user} ticket={ticket} key={index} updateTickets={updateTickets} />)}
  </div>
);

export default TicketList;
