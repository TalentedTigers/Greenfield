import React from 'react';
import ReactDOM from 'react-dom';

const Review = ({handleReview}) => (
  <div className="review">
    <h5><strong>Session Review </strong> (optional) </h5>
    <h6>
      Please write a few sentences to describe your experience with this mentor. We also recommend writing down what
      you talked about in this session. This review is very important for the mentor, as it can influence other students 
      who are interested in learning with this mentor.
    </h6>     
    <textarea className='ticket_submission_description' className="form-control" name="description" placeholder="" onInput={handleReview}></textarea>
  </div>
);

export default Review;
