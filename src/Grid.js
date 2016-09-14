import React from 'react';
import Point, {RADIUS} from './Point';

const LEFT_MOUSE_BUTTON = 0;
const RIGHT_MOUSE_BUTTON = 2;

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

  clientToPoint: function(p) {
    var scale = this.state.scale;

    var relX = p.clientX - this.state.origin.clientX;
    var relY = p.clientY - this.state.origin.clientY;

    var closestX = Math.round( 1.0 * relX / scale);
    var closestY = Math.round(-1.0 * relY / scale);

    return {x: closestX, y: closestY};
  },

  pointToRel: function(p) {
    var scale = this.state.scale;
    return {relX: p.x * scale, relY: -p.y * scale};
  },

  dragGridStart: function(e) {
    console.log("drag start");
    //e.target.setCapture(); // allows drag and stuff outside the window, but broken in chrome
    this.mouseData.dragging = true;
    this.mouseData.dragStartOrigin = {
      clientX: this.state.origin.clientX,
      clientY: this.state.origin.clientY,
    };
    this.mouseData.dragStartMousePos = {
      clientX: e.clientX,
      clientY: e.clientY,
    };
  },

  handleMouseDown: function(e) {
    /* on left click:
     * if at grid point, create point / line
     * otherwise move grid
     *
     * on right click:
     * if on point, move point
     * otherwise move grid
     */

    if (e.button === LEFT_MOUSE_BUTTON) {
      var closest = this.clientToPoint(e);
      var ppos = this.pointToRel(closest);
      var mpos = {
        relX: e.clientX - this.state.origin.clientX,
        relY: e.clientY - this.state.origin.clientY,
      };

      // only create a point if sufficiently close
      if (Math.hypot(ppos.relX - mpos.relX, ppos.relY - mpos.relY) < 3 * RADIUS) {
        var newPoints = this.state.points.slice(0); // a copy, also doesn't actually work since array of objects
        newPoints.push(closest);
        this.setState({points: newPoints});
        // TODO: create line?
      } else {
        this.dragGridStart(e);
      }
    } else if (e.button === RIGHT_MOUSE_BUTTON) {
      // TODO: move point
      this.dragGridStart(e);
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
    if (this.mouseData.dragging) {
      console.log("drag end");
      this.mouseData.dragging = false;
    }
  },

  preventContextMenu: function(e) {
    e.preventDefault();
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
           onContextMenu={this.preventContextMenu}
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
