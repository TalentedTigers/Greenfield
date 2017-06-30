import React from 'react';
import ReactDom from 'react-dom';
import AddUser from './addUser.jsx';
import AdminFilter from './adminFilter.jsx';

const AdminDashboard = ({filterTickets, statistic, ticketCategoryList}) => (
  <div id="admin-dashboard">
    <h4>Active Students: {statistic.studentNum}</h4>
    <h4>Active Mentors: {statistic.mentorNum}</h4>
    <h4>Current Average Wait Time: {statistic.currAveWait} minutes</h4>
    <AddUser />
    <AdminFilter filterTickets={filterTickets} ticketCategoryList={ticketCategoryList}/>
  </div>
);

export default AdminDashboard;
