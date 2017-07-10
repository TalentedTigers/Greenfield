import React from 'react';
import Whiteboard from './whiteboard.jsx';
import Chat from './chat.jsx';


const InteractiveSession = ({user, partner, socket, signOff, sendP2P}) => (
  <div className='interactive'>
    <button onClick={signOff} type="button" className="btn btn-xs btn-primary isession_button">Exit Session</button> 
    <span className="iElementContainer">
      <span className="leftGroup">
        <Chat user={user} partner={partner} socket={socket} sendP2P={sendP2P} />
      </span>
        <Whiteboard socket={socket} sendP2P={sendP2P}/>
    </span>
  </div>
);

export default InteractiveSession;
