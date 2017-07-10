import React from 'react';
import ReactDOM from 'react-dom';
import SeatingChart from './seatingChart.jsx';


class TicketSubmission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
    };

    this.clickSeating = (evt) => { this.setState({location: evt.target.getAttribute('data-location')}); };
    this.handleLocationChange = (evt) => { this.setState({location: evt.target.value}); };
  }

  render() {
    return (

      <form className="ticket_submission_form">
        <div className="col-xs-4">
          <button
            type="button"
            className="btn btn-primary"
            style={{position: 'absolute' , top: 77 , left: 882, zIndex: 1200}}
            data-toggle="modal"
            data-target="#myModalFeedback"
          >
            Rate Your Latest Experience
          </button>
        </div> 

        <div className="form-group row">
          <div className="col-xs-12"><h3>Create a ticket</h3></div>
        </div>

        <div className="form-group row">
          <div className="col-xs-3">
            <label htmlFor="ticket_submission_category">Category</label>
            <select className="form-control" id="ticket_submission_category" name="category">
              {this.props.ticketCategoryList.map((category, index) => <option key={index}>{category}</option>)}
            </select>
          </div>

          <div className="col-xs-5">
            <label htmlFor="ticket_submission_location">Location</label>
            <div className="input-group">
              <input type="text" id="ticket_submission_location" className="form-control" name="location" placeholder={'Your station number'} value={this.state.location} onChange={this.handleLocationChange}/>
              <span className="input-group-btn">

                <SeatingChart clickSeating={this.clickSeating.bind(this)}/>

                <button
                  type="button"
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#myModal">
                  Use Seating Chart
                </button>
                
              </span>
            </div>
          </div>  
      
          <div className="col-xs-3">
            <label htmlFor="ticket_submission_private">Private?</label>
            <div className="checkbox">
              <label><input type="checkbox" id="is_private" /></label>
            </div>
          </div>
      
        </div>

        <div className="row">
          <div className="col-xs-10">
            <textarea id="ticket_submission_description" className="form-control" name="description" placeholder="Ticket description"></textarea>
          </div>
          <div className="col-xs-2">
            <button onClick={this.props.submitTickets} type="submit" id="ticket_submission_button" className="btn btn-primary">Submit Ticket</button>
          </div>
        </div>
      </form>
    );
  }
}

// const TicketSubmission = ({submitTickets, ticketCategoryList, location, handleLocationChange}) => (

export default TicketSubmission;
