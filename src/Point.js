import React from 'react';

export const RADIUS = 4;

var Point = React.createClass({
  render: function() {
    var style = {
        background: "blue",
        borderRadius: "50%",
        width: 2*RADIUS + 1, // +1 to center
        height: 2*RADIUS + 1,
        position: "absolute",
        top: this.props.top - RADIUS,
        left: this.props.left - RADIUS,
    };

    return (
      <div className="Point" style={style}>
      </div>
    );
  }
});

export default Point;
