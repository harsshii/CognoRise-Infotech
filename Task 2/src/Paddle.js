// Paddle.js
import React from 'react';

const Paddle = ({ x, y, height }) => {
  return <div style={{ position: 'absolute', left: x, top: y, height: height, width: '10px', background: '#fff' }}></div>;
};

export default Paddle;
