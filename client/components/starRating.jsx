import React from 'react';
import ReactDOM from 'react-dom';

class StarRating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: null
    };
  }

  toggle(position) {
    if (this.state.active === position) {
      this.setState({ active: null});
    } else {
      this.setState({ active: position});
    }
  }

  myColor(position) {
    if (this.state.active === position) {
      return 'green';
    }
    return '';
  }

  render() {
    return (
      <div className="review">
        <h5><strong>Mentor Quality Evaluation</strong></h5>
        <h6>
          Please rate your experience with this mentor. This rating will become part of the mentor's
          'Quality Score'. You should take into account how helpful, professional, and knowledgable your mentor was
        </h6>

        <div className="starrow">
          <div className="btn-group" data-toggle="buttons">  
            <div onClick={this.props.handleRatingClick} style={{backgroundColor: this.myColor(1)}} onClick={() => { this.toggle(1); }} data-location='1' className='star' ><span className="letterLine">1</span></div>
            <div onClick={this.props.handleRatingClick} style={{backgroundColor: this.myColor(2)}} onClick={() => { this.toggle(2); }} data-location='2' className='star' ><span className="letterLine">2</span></div>
            <div onClick={this.props.handleRatingClick} style={{backgroundColor: this.myColor(3)}} onClick={() => { this.toggle(3); }} data-location='3' className='star' ><span className="letterLine">3</span></div>
            <div onClick={this.props.handleRatingClick} style={{backgroundColor: this.myColor(4)}} onClick={() => { this.toggle(4); }} data-location='4' className='star' ><span className="letterLine">4</span></div>
            <div onClick={this.props.handleRatingClick} style={{backgroundColor: this.myColor(5)}} onClick={() => { this.toggle(5); }} data-location='5' className='star' ><span className="letterLine">5</span></div>
          </div>
        </div>

      </div>
    );
  }
}


export default StarRating;
/*
<label className="btn btn-primary">
              <input onClick={this.props.handleRatingClick} type="radio" name="options" id="option1" autoComplete="off" value='1'/> 1
            </label>
            <label className="btn btn-primary">
              <input onChange={this.props.handleRatingClick} type="radio" name="options" id="option2" autoComplete="off" value='2'/> 2
            </label>
            <label className="btn btn-primary">
              <input onChange={this.props.handleRatingClick} type="radio" name="options" id="option3" autoComplete="off" value='3'/> 3
            </label>
            <label className="btn btn-primary">
              <input onChange={this.props.handleRatingClick} type="radio" name="options" id="option1" autoComplete="off" value='4'/> 4
            </label>
            <label className="btn btn-primary">
              <input onChange={this.props.handleRatingClick} type="radio" name="options" id="option2" autoComplete="off" value='5'/> 5
            </label>
*/