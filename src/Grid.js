import React from 'react';
import Point, {RADIUS} from './Point';

var Grid = React.createClass({
  getInitialState: function() {
    return {
      scale: 40,
      origin: {clientX: 0, clientY: 0},
      points: [
        {x: 0, y: 0},
      ],
    }
  },

  mouseData: {
    dragging: false,
    dragStartOrigin: {clientX: 0, clientY: 0},
    dragStartMousePos: {clientX: 0, clientY: 0},
  },

  closestPoint: function(p) {
    var scale = this.state.scale;

    var relX = p.clientX - this.state.origin.clientX;
    var relY = p.clientY - this.state.origin.clientY;

    var closestX = Math.round( 1.0 * relX / scale);
    var closestY = Math.round(-1.0 * relY / scale);

    return {x: closestX, y: closestY};
  },

  handleMouseDown: function(e) {
    var scale = this.state.scale;

    var clientX = e.clientX - this.state.origin.clientX;
    var clientY = e.clientY - this.state.origin.clientY;

    var closestX = Math.round(1.0 * clientX / scale);
    var closestY = Math.round(-1.0 * clientY / scale);

    // only create a point if sufficiently close
    if (Math.hypot(closestX *  scale - clientX, closestY * -scale - clientY) < 3 * RADIUS) {
      var newPoints = this.state.points.slice(0); // a copy
      newPoints.push({x: closestX, y: closestY});
      this.setState({points: newPoints});
    } else {
      console.log("drag start");
      e.target.setCapture(); // allows drag and stuff outside the window
      this.mouseData.dragging = true;
      this.mouseData.dragStartOrigin = {
        clientX: this.state.origin.clientX,
        clientY: this.state.origin.clientY,
      };
      this.mouseData.dragStartMousePos = {
        clientX: e.clientX,
        clientY: e.clientY,
      };
    }
  },

  handleMouseMove: function(e) {
    if (this.mouseData.dragging) {
      console.log("dragging");
      var dx = e.clientX - this.mouseData.dragStartMousePos.clientX;
      var dy = e.clientY - this.mouseData.dragStartMousePos.clientY;
      var newOrigin = {
        clientX: this.mouseData.dragStartOrigin.clientX + dx,
        clientY: this.mouseData.dragStartOrigin.clientY + dy,
      };
      this.setState({origin: newOrigin});
    }
  },

  handleMouseUp: function(e) {
    console.log("drag end");
    this.mouseData.dragging = false;
  },

  render: function() {
    var scale = this.state.scale;
    var origin = this.state.origin;

    var style = {
      backgroundSize: scale + 'px ' + scale + 'px',
      backgroundImage: 'linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px)',
      height: '100vh',
      width: '100vw',
      backgroundPosition: origin.clientX + 'px ' + origin.clientY + 'px',
      position: 'fixed',
    };

    return (
      <div className="Grid"
           style={style}
           onMouseDown={this.handleMouseDown}
           onMouseMove={this.handleMouseMove}
           onMouseUp={this.handleMouseUp}>
        <div style={{position: 'fixed', top: origin.clientY, left: origin.clientX}}>
          {this.state.points.map(function(p) {
            return <Point relY={-p.y*scale} relX={p.x*scale}/>;
          })}
        </div>
      </div>
    );
  }
});

export default Grid;
