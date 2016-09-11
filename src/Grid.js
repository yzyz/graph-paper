import React from 'react';
import Point, {RADIUS} from './Point';

var Grid = React.createClass({
  getInitialState: function() {
    return {
      scale: 40,
      origin: {top: 200, left: 560},
      points: [
        {x: 0, y: 0},
      ],
    }
  },

  mouseData: {
    dragging: false,
    dragStartOrigin: {top: 0, left: 0},
    dragStartMousePos: {clientX: 0, clientY: 0},
  },

  handleClick: function(e) {
    var scale = this.state.scale;

    var clientX = e.clientX - this.state.origin.left;
    var clientY = e.clientY - this.state.origin.top;

    var closestX = Math.round(1.0 * clientX / scale);
    var closestY = Math.round(-1.0 * clientY / scale);

    // only create a point if sufficiently close
    if (Math.hypot(closestX *  scale - clientX, closestY * -scale - clientY) < 3 * RADIUS) {
      var newPoints = this.state.points.slice(0); // a copy
      newPoints.push({x: closestX, y: closestY});
      this.setState({points: newPoints});
    }
  },

  // TODO: switch over to mouseDown / mouseMove. onDrag is too annoying
  handleDragOver: function(e) {
    e.preventDefault();
  },

  handleDragStart: function(e) {
    console.log("drag start");
    e.dataTransfer.setData("text", e.target.id);
    e.dataTransfer.mozCursor = 'default';
    // hide drag image
    e.dataTransfer.setDragImage(new Image(), 0, 0);

    this.mouseData.dragging = true;
    this.mouseData.dragStartOrigin = {
      top:  this.state.origin.top,
      left: this.state.origin.left,
    };
    this.mouseData.dragStartMousePos = {
      clientX: e.clientX,
      clientY: e.clientY,
    };
  },

  handleDrag: function(e) {
    console.log("dragging");
    // broken in firefox
    var dy = e.clientY - this.mouseData.dragStartMousePos.clientY;
    var dx = e.clientX - this.mouseData.dragStartMousePos.clientX;
    var newOrigin = {
      top:  this.mouseData.dragStartOrigin.top  + dy,
      left: this.mouseData.dragStartOrigin.left + dx,
    };
    //console.log(newOrigin);
    this.setState({origin: newOrigin});
  },

  handleDragEnd: function(e) {
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
      backgroundPosition: origin.left + 'px ' + origin.top + 'px',
      position: 'fixed',
    };

    return (
      <div className="Grid"
           style={style}
           onClick={this.handleClick}
           draggable={true}
           onDragOver={this.handleDragOver}
           onDragStart={this.handleDragStart}
           onDrag={this.handleDrag}
           onDragEnd={this.handleDragEnd}>
        <div style={{position: 'fixed', top: origin.top, left: origin.left}}>
          {this.state.points.map(function(p) {
            return <Point top={-p.y*scale} left={p.x*scale}/>;
          })}
        </div>
      </div>
    );
  }
});

export default Grid;
