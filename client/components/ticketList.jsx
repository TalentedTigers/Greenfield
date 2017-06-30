import React from 'react';
import ReactDOM from 'react-dom';
import TicketEntry from './ticketEntry.jsx';

const TicketList = ({user, ticketList, updateTickets, hasClaimed}) => (
  <div className="ticket_list">
    {ticketList.map((ticket, index) => <TicketEntry user={user} ticket={ticket} key={index} updateTickets={updateTickets} hasClaimed={hasClaimed} />)}
  </div>
);

export default TicketList;
