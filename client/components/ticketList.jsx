import React from 'react';
import ReactDOM from 'react-dom';
import TicketEntry from './ticketEntry.jsx';

const TicketList = ({socket, user, ticketList, updateTickets, hasClaimed, sendP2P}) => (
  <div className="ticket_list">
    {ticketList.map((ticket, index) => <TicketEntry socket={socket} user={user} ticket={ticket} updateTickets={updateTickets} hasClaimed={hasClaimed} sendP2P={sendP2P} key={index}/>)}
  </div>
);

export default TicketList;
