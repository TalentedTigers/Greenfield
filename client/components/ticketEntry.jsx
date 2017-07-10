import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';



class TicketEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      now: new Date(),
      countStars: null
    };
  }
  componentDidMount() {
    this.timer = setInterval(() => this.setState({ now: new Date() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  handleRatingClick(event) {
    this.setState({
      countStars: event.target.getAttribute('data-name')
    });
  }

  startSession(){
    let options = {
      to: this.props.ticket.user,
      event: 'initiate session',
      ticket: this.props.ticket
    };
    this.props.sendP2P(options);
  }

  claimTicket(){
    this.props.updateTickets({ id: this.props.ticket.id, status: 'Claimed' });
  }

  render() {
    let claimButton = null;
    let closeButton = null;
    let ratingComponent = null;
    let claimed = null;
    let className = null;
    let time = null;
    let isOnline = this.props.ticket.user.online;
    let isOnlineButton = null;
    let description = null;
    let showPrivateIcon = false;


    if (this.props.ticket.status === 'Opened') {
      className = 'alert-success';
      time = `opened ${moment(this.props.ticket.createdAt).from(this.state.now)}`;
    } else if (this.props.ticket.status === 'Claimed') {
      claimed = <div className="ticket_list_entry_claimed">by {this.props.ticket.userClaimed.firstName} {this.props.ticket.userClaimed.lastName}</div>;
      className = 'alert-info';
      time = `claimed ${moment(this.props.ticket.claimedAt).from(this.state.now)}`;
    } else {
      className = 'alert-danger';
      time = `closed ${moment(this.props.ticket.closedAt).from(this.state.now)}`;
    }

    if (this.props.ticket.status === 'Opened' && this.props.ticket.userId !== this.props.user.id) {
      claimButton = <button onClick={() => this.props.updateTickets({ id: this.props.ticket.id, status: 'Claimed' })} type="button" className="btn btn-xs btn-primary claim_btn">Claim</button>;
      if(isOnline) { 
        isOnlineButton = <button onClick={this.startSession.bind(this)} type="button" className="btn btn-xs btn-primary claim_btn">Online Now</button>; 
      }
    }

    if (this.props.ticket.status !== 'Closed' && (this.props.ticket.claimedBy === this.props.user.id || this.props.ticket.userId === this.props.user.id || this.props.user.role === 'admin')) {
      closeButton = <button onClick={() => this.props.updateTickets({ id: this.props.ticket.id, status: 'Closed', user: this.props.ticket.user })} type="button" className="btn btn-xs btn-danger">Close</button>;
    }
    if (this.props.ticket.status === 'Closed' && this.props.user.role === 'student' && this.props.ticket.userId === this.props.user.id) {
      ratingComponent = <button
        type="button"
        className="btn btn-xs btn-primary claim_btn"
        data-toggle="modal"
        data-target="#myModalFeedback">
        Rate Your Experience
      </button>;
    }

    if (this.props.ticket.private && this.props.ticket.user.username !== this.props.user.username && this.props.user.role === 'student') {
      this.props.ticket.user.firstName = 'Fellow Hacker';
      this.props.ticket.user.lastName = null;
      this.props.ticket.location = this.props.ticket.location.slice(0,4);
      className += ' dim';
      description = null;
      showPrivateIcon = !showPrivateIcon;
    } else {
      description = <div className="ticket_list_entry_description"> {this.props.ticket.description} </div>;
    }

    return (
      <div className={`ticket_list_entry alert clearfix ${className}`} >
        <div className="ticket_list_entry_meta clearfix">
          <div className="ticket_list_entry_name">{this.props.ticket.user.firstName} {this.props.ticket.user.lastName} ({this.props.ticket.location})</div>
          <div className="ticket_list_entry_time">- {time}</div>
          {claimed}
          {showPrivateIcon || this.props.user.role === 'mentor' && this.props.ticket.private ?
            <svg fill="#000000" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none"/>
              <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
            </svg> : null
          }
        </div>
        <div className="ticket_list_entry_buttons">
          <span className="btn btn-xs btn-default">{this.props.ticket.category}</span>
          {isOnlineButton}
          {claimButton}
          {closeButton}
          {ratingComponent}
        </div>
        {description}
      </div>
    );
  }
}

export default TicketEntry;

