import React from 'react';


var Line = React.createClass({
  render: function() {
    var x1 = this.props.a.relX;
    var y1 = this.props.a.relY;
    var x2 = this.props.b.relX;
    var y2 = this.props.b.relY;

    var len = Math.hypot(x2 - x1, y2 - y1);
    var theta = Math.atan2(y2 - y1, x2 - x1);

    var style = {
      background: "blue",
      position: "absolute",
      height: 1,
      width: len,
      transformOrigin: "0% 50%",
      transform: "rotate(" + theta + "rad)",
    };

    return (
      <div className="Line" style={style}>
      </div>
    );
  }
});

export default Line;
