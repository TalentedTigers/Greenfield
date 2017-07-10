import React from 'react';
import ReactDOM from 'react-dom';

class WhiteBoard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isEnabled: false,
      mouseClick: false,
      mouseMove: false,
      mousePos: {x:0, y:0},
      mousePosPrev: false
    }
  }

  handleMouseDown(e) {
    this.setState({mouseClick:true});
  }

  handleMouseMove(e) {
    this.setState({mousePos: {x:e.pageX, y:e.pageY}});
    this.setState({mouseMove:true});
  };

  handleMouseUp(e) {
    this.setState({mouseClick:false});
  }

  mainLoop() {
    if (this.state.isEnabled) {
      if (this.state.mouseClick && this.state.mouseMove && this.state.mousePosPrev) {
        let line = [ this.state.mousePos, this.state.mousePosPrev ];
        const options = {
          event: 'draw_line',
          line: line
        };
        this.draw('local', line);
        this.props.sendP2P(options);
        this.setState({mouseMove: true});
      }
      this.setState({mousePosPrev: {x: this.state.mousePos.x, y: this.state.mousePos.y}});
      setTimeout(this.mainLoop.bind(this), 10);
    }
  }

  draw(client, line) {
    const canvas = this.refs.canvas
    const context = this.refs.canvas.getContext('2d')
    var width   = window.innerWidth;
    var height  = window.innerHeight;
    context.strokeStyle = (client === 'local') ? '#df4b26' : '#0000FF';
    context.lineJoin = "round";
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(line[0].x - canvas.offsetLeft, line[0].y - canvas.offsetTop);
    context.lineTo(line[1].x - canvas.offsetLeft, line[1].y - canvas.offsetTop);
    context.stroke();
  }
  
  componentDidMount() {
    this.props.socket.on('draw_line', data => this.draw('remote', data.line));
    this.state.isEnabled = true;
    this.mainLoop();
  }

  componentWillUnmount() {
    this.state.isEnabled = false;
  }

  render() {
    return (
      <canvas 
        className="whiteboard"
      	onMouseMove={this.handleMouseMove.bind(this)}
      	onMouseUp={this.handleMouseUp.bind(this)}
        onMouseDown={this.handleMouseDown.bind(this)}
        ref="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
      />
    );
  }
}



export default WhiteBoard;