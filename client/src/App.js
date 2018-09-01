import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import socketIOClient from 'socket.io-client'
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      endpoint: "http://192.168.0.57:4001",
      color: 'white',
      socket: null
    }
  }
  send = () => {
    this.state.socket.emit('change color', this.state.color)
  }

  setColor = (color) => {
    this.setState({ color })
  }

  componentDidMount(){
    const socket = socketIOClient(this.state.endpoint);
    this.setState({
      socket: socket,
    });

    let ctx = ReactDOM.findDOMNode(this.refs.myCanvas).getContext("2d");
    ctx.font = '30px Arial';

    socket.on('change color', (col) => {
      this.setState({
        color: col,
      });
      
      ctx.fillStyle = col
      ctx.fillRect(0, 0, 500, 500);
    })
    
    socket.on('newPosition', (data) => {
      ctx.clearRect(0,0,500,500);

      ctx.fillStyle = this.state.color;
      ctx.fillRect(0, 0, 500, 500);

      ctx.fillStyle = "black"
      ctx.fillText('P', data.x, data.y);
    })
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <button onClick={() => this.send() }>Change Color</button>
        <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
        <button id="red" onClick={() => this.setColor('red')}>Red</button>
        <br/>
        <canvas ref="myCanvas" id="ctx" width="500" height="500" className="love"/>      
      </div>
    )
  }
}

export default App;
