import React from 'react';
import ReactDOM from 'react-dom';

const WaitTime = ({waitTime}) => (
  <div id="wait_time" className="col-md-4">
    Est. wait time {waitTime}
  </div>
);

export default WaitTime;
