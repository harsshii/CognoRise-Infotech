// Ball.js
import React from 'react';

const Ball = ({ x, y, radius }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        height: `${radius * 2}px`,
        width: `${radius * 2}px`,
        borderRadius: '50%',
        background: '#fff',
      }}
    ></div>
  );
};

export default Ball;
