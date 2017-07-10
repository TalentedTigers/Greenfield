import React from 'react';
import ReactDOM from 'react-dom';

const SeatingChart = ({clickSeating}) => (
  <div>
    <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 className="modal-title" id="myModalLabel">Select your pairing station</h4>
          </div>
          <div className="modal-body">
            <div className="center">
              <div className='mentor-section'><h5 className="htable">HIR Table</h5></div>
              <div className='section'>
                <div className='row-3'>
                  <div onClick={clickSeating} data-location='hr77-01' className='station' data-dismiss="modal"><span className="numberInPair">1</span></div>
                  <div onClick={clickSeating} data-location='hr77-02' className='station' data-dismiss="modal"><span className="numberInPair">2</span></div>
                  <div onClick={clickSeating} data-location='hr77-03' className='station' data-dismiss="modal"><span className="numberInPair">3</span></div>
                </div>
                <div className='row-3'>
                  <div onClick={clickSeating} data-location='hr77-04' className='station' data-dismiss="modal"><span className="numberInPair">4</span></div>
                  <div onClick={clickSeating} data-location='hr77-05' className='station' data-dismiss="modal"><span className="numberInPair">5</span></div>
                  <div onClick={clickSeating} data-location='hr77-06' className='station' data-dismiss="modal"><span className="numberInPair">6</span></div>
                </div>
              </div>
              <div className='section'>
                <div className='row-2'>
                  <div onClick={clickSeating} data-location='hr77-07' className='station' data-dismiss="modal"><span className="numberInPair">7</span></div>
                  <div onClick={clickSeating} data-location='hr77-08' className='station' data-dismiss="modal"><span className="numberInPair">8</span></div>
                </div>
                <div className='row-2'>
                  <div onClick={clickSeating} data-location='hr77-09' className='station' data-dismiss="modal"><span className="numberInPair">9</span></div>
                  <div onClick={clickSeating} data-location='hr77-10' className='station' data-dismiss="modal"><span className="numberInPair">10</span></div>
                </div>
              </div>
              <div className='section'>
                <div className='row-3'>
                  <div onClick={clickSeating} data-location='hr77-11' className='station' data-dismiss="modal"><span className="numberInPair">11</span></div>
                  <div onClick={clickSeating} data-location='hr77-12' className='station' data-dismiss="modal"><span className="numberInPair">12</span></div>
                  <div onClick={clickSeating} data-location='hr77-13' className='station' data-dismiss="modal"><span className="numberInPair">13</span></div>
                </div>
                <div className='row-3'>
                  <div onClick={clickSeating} data-location='hr77-14' className='station' data-dismiss="modal"><span className="numberInPair">14</span></div>
                  <div onClick={clickSeating} data-location='hr77-15' className='station' data-dismiss="modal"><span className="numberInPair">15</span></div>
                  <div onClick={clickSeating} data-location='hr77-16' className='station' data-dismiss="modal"><span className="numberInPair">16</span></div>
                </div>
              </div>
              <div className='section'>
                <div className='row-3'>
                  <div onClick={clickSeating} data-location='hr77-17' className='station' data-dismiss="modal"><span className="numberInPair">17</span></div>
                  <div onClick={clickSeating} data-location='hr77-18' className='station' data-dismiss="modal"><span className="numberInPair">18</span></div>
                  <div onClick={clickSeating} data-location='hr77-19' className='station' data-dismiss="modal"><span className="numberInPair">19</span></div>
                </div>
                <div className='row-3'>
                  <div onClick={clickSeating} data-location='hr77-20' className='station' data-dismiss="modal"><span className="numberInPair">20</span></div>
                  <div onClick={clickSeating} data-location='hr77-21' className='station' data-dismiss="modal"><span className="numberInPair">21</span></div>
                  <div onClick={clickSeating} data-location='hr77-22' className='station' data-dismiss="modal"><span className="numberInPair">22</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SeatingChart;
