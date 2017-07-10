import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import TicketList from './components/ticketList.jsx';
import TicketSubmission from './components/ticketSubmission.jsx';
import Login from './components/login.jsx';
import Alert from './components/alert.jsx';
import Nav from './components/nav.jsx';
import Header from './components/header.jsx';
import AdminDashboard from './components/adminDashboard.jsx';
import SeatingChart from './components/seatingChart.jsx';
import Feedback from './components/feedback.jsx';
import InteractiveSession from './components/interactiveSession.jsx';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      ticketList: [],
      ticketCategoryList: ['React', 'Socket.IO', 'Recursion', 'Postgres'],
      user: null,
      isAuthenticated: false,
      onlineUsers: {},
      statistic: {},
      waitTime: 0,
      location: '',
      countStars: null,
      review: null,
      ticket: null,
      ticketClaimed: false,
      sessionPartner: { firstName: 'anonymous' },
      sessionIsActive: false
    };
  }

  componentWillMount() {
    $.ajax({
      url: '/api/users/:id',
      type: 'GET',
      async: false,
      success: (response) => {
        if (response.user) {
          this.setState({
            user: response.user,
            isAuthenticated: true
          });
        } else if (response) {
          this.setState({ user: response });
        }
      },
      error: () => {
        console.log('failed');
      }
    });
  }
  
  componentDidMount() {
    if (!this.state.user) { return; }
    let option = {
      id: this.state.user.id,
      role: this.state.user.role
    };
    this.socket = io({ query: option });
    this.socket.emit('update adminStats');

    this.socket.on('update or submit ticket', () => {
      return option.role === 'admin' ? this.filterTickets() : this.getTickets(option);
    });

    this.socket.on('new adminStats', data => this.setState({ statistic: data }));

    this.socket.on('new wait time', data => this.setState({ waitTime: data.waitTime }));

    this.socket.on('user connect', data => this.setState({ onlineUsers: data }));

    this.socket.on('user disconnect', data => this.setState({ onlineUsers: data }));

    this.socket.on('initiate session', options => this.setUpClientSession(options));

    this.socket.on('invitation response', options => this.handleSessionResponse(options));

    this.socket.on('sign off session', options => this.partnerSignedOff(options));
    
    this.getTickets(option);
  }
  
  clickSeating(evt) {
    this.setState({location: evt.target.getAttribute('data-location')});
  }
  handleRatingClick(evt) {
    this.setState({
      countStars: evt.target.getAttribute('data-location')
    });
  }

  handleReview(evt) {
    this.setState({
      review: evt.target.value
    });
  }

  getTickets(option) {
    $.get('/api/tickets', option, (tickets) => {
      this.setState({ ticketList: tickets });
      this.hasClaimed(this.state.user.id);
    });
  }

  getLatestClosedTicket(data) {

    $.get('/api/tickets', (tickets) => {
      let context = this;
      let result = tickets.filter((ticket) => (ticket.status === 'Closed' && ticket.userId === context.state.user.id));

      let getLatestClosedTicket = result[0];

      $.ajax({
        url: `/api/tickets/${getLatestClosedTicket.id}`,
        type: 'PUT',
        data: data,
        success: (response) => {
          console.log('PUT request was successful');
        },
        error: (err) => {
          console.log('failed to update ticket');
        }
      });
    });
  }

  submitTickets(e) {
    $('.ticket_submission_form').validate({
      rules: {
        category: 'required',
        location: 'required',
        description: 'required'
      },
      submitHandler: (form) => {
        let ticket = {
          userId: this.state.user.id,
          category: document.getElementById('ticket_submission_category').value,
          location: document.getElementById('ticket_submission_location').value,
          description: document.getElementById('ticket_submission_description').value,
          private: document.getElementById('is_private').checked,
          status: 'Opened'
        };
        $.ajax({
          url: '/api/tickets',
          type: 'POST',
          data: ticket,
          success: (response) => {
            this.socket.emit('refresh');
            this.socket.emit('update adminStats');
            document.getElementById('ticket_submission_location').value = '';
            document.getElementById('ticket_submission_description').value = '';
          },
          error: () => {
            console.log('Error submitting ticket');
          }
        });
      },
      errorPlacement: function(error, element) {} // Do not show error messages
    });
  }

  updateTickets(data) {
    if (data.status === 'Claimed') {
      data.claimedBy = this.state.user.id;
    }

    $.ajax({
      url: `/api/tickets/${data.id}`,
      type: 'PUT',
      data: data,
      success: (response) => {
        this.socket.emit('refresh');
        this.socket.emit('update adminStats');
        this.socket.emit('get wait time');
      },
      error: (err) => {
        console.log('failed to update ticket');
      }
    });
  }

  filterTickets(e) {
    if (e) { e.preventDefault(); }
    let day = document.getElementById('time-window').value;
    let category = document.getElementById('select-category').value;
    let status = document.getElementById('ticket-status').value;
    let type = 'createdAt';

    let timeWindow = day === 'All' ? { $not: 0 }
      : { $gte: new Date(new Date() - day * 24 * 60 * 60 * 1000) };
    if (category === 'All') { category = { $not: null }; }
    if (status === 'All') {
      status = { $not: null };
    } else if (status === 'Closed') {
      type = 'closedAt';
    } else if (status === 'Claimed') {
      type = 'claimedAt';
    }
    let option = {
      id: this.state.user.id,
      role: this.state.user.role,
      category: category,
      status: status,
      [type]: timeWindow
    };

    this.getTickets(option);
  }

  hasClaimed(id) {
    // need to fix this
    const ticketList = this.state.ticketList;
    for (let i = 0; i < ticketList.length; i++) {
      if (ticketList[i].status !== 'Claimed') { break; }
      if (ticketList[i].status === 'Claimed' && ticketList[i].claimedBy === id) {
        return $('.claim_btn').prop('disabled', true);
      }
    }
    return $('.claim_btn').prop('disabled', false);
  }

  sendP2P(options) {
    options.from = this.state.user;
    options.to = options.to || this.state.sessionPartner;
    this.socket.emit('p2p', options);
  }

  activateSession(options) {
    this.setState({
      sessionIsActive: true,
      sessionPartner: options.from
    });
  }

  deactivateSession() {
    this.setState({
      sessionIsActive: false,
      sessionPartner: { firstName: 'anonymous' }
    });
  }

  partnerSignedOff(options) {
    alert(`${options.from.firstName} signed off`);
    this.deactivateSession();
  }
  
  signOff() {
    const signOffMessage = {
      to: this.state.sessionPartner,
      event: 'sign off session'
    };
    this.sendP2P(signOffMessage);
    this.deactivateSession();
  }
  
  setUpClientSession(options) {
    const response = {
      to: options.from,
      event: 'invitation response',
      ticket: options.ticket,
      isAccepted: false
    };

    if ( confirm(`Mentor ${options.from.firstName} would like to connect for an interactive session regarding ${options.ticket.description}. Would you like to connect?`) ) {
      this.activateSession(options);
      response.isAccepted = true;
    }
    this.sendP2P(response);
  }

  handleSessionResponse(options) {
    if (options.isAccepted) {
      this.activateSession(options);
      this.updateTickets({ id: options.ticket.id, status: 'Claimed' });
    } else {
      alert('Session invitation declined');
    }
  }
  
  render() {
    let user = this.state.user;
    let isAuthenticated = this.state.isAuthenticated;
    let nav = null;
    let header = null;
    let main = null;
    let list = null;

    let login = <Login />;
    
    let feedback = <Feedback
      countStars={this.state.countStars}
      review={this.state.review}
      handleRatingClick={this.handleRatingClick.bind(this)}
      handleReview={this.handleReview.bind(this)}
      getLatestClosedTicket={this.getLatestClosedTicket.bind(this)}
    />;

    let ticketSubmission = <TicketSubmission
      submitTickets={this.submitTickets.bind(this)}
      ticketCategoryList={this.state.ticketCategoryList}
      location={this.state.location}
      getLatestClosedTicket={this.getLatestClosedTicket.bind(this)}
      countStars={this.state.countStars}
      review={this.state.review}
      handleRatingClick={this.handleRatingClick.bind(this)}
      handleReview={this.handleReview.bind(this)}
    />;

    let ticketList = <TicketList
      sendP2P={this.sendP2P.bind(this)}
      user={this.state.user}
      ticketList={this.state.ticketList}
      updateTickets={this.updateTickets.bind(this)}
      hasClaimed={this.state.hasClaimed}
    />;

    let adminDashboard = <AdminDashboard
      filterTickets={this.filterTickets.bind(this)}
      onlineUsers={this.state.onlineUsers}
      adminStats={this.state.statistic}
      ticketCategoryList={this.state.ticketCategoryList}
    />;

    let interactiveSession = <InteractiveSession
      user={this.state.user}
      partner={this.state.sessionPartner}
      socket={this.socket}
      signOff={this.signOff.bind(this)}
      sendP2P={this.sendP2P.bind(this)}
    />;
    
    if (isAuthenticated) {
      nav = <Nav user={this.state.user} />;
      header = <Header statistic={this.state.statistic} onlineUsers={this.state.onlineUsers} user={this.state.user} waitTime={this.state.waitTime}/>;
      list = ticketList;
    }

    if (!isAuthenticated) {
      document.querySelector('BODY').style.backgroundColor = '#2b3d51';
      main = login;
    } else if (isAuthenticated && user.role === 'student' && !this.state.sessionIsActive) {
      main = ticketSubmission;
      list = ticketList;
    } else if (isAuthenticated && user.role === 'student' && this.state.sessionIsActive) {
      main = interactiveSession;
      header = null;
      list = null;
    } else if (isAuthenticated && user.role === 'mentor' && !this.state.sessionIsActive) {
      list = ticketList;
    } else if (isAuthenticated && user.role === 'mentor' && this.state.sessionIsActive) {
      main = interactiveSession;
      header = null;
      list = null;
    } else if (isAuthenticated && user.role === 'admin') {
      main = adminDashboard;
      list = ticketList;
    } 

    let body = (!this.state.sessionIsActive) ?
     (<div className="container">
          {feedback}
          {main}
          {list}
      </div>) : interactiveSession;
    
    return (
      <div>
        <Alert />
        {nav}
        {header}
        {body}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
