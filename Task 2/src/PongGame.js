// PongGame.js
import React, { useEffect, useState } from 'react';

const PongGame = () => {
  const paddleHeight = 100;
  const paddleWidth = 10;
  const ballRadius = 10;

  const [paddle1Y, setPaddle1Y] = useState(250 - paddleHeight / 2);
  const [paddle2Y, setPaddle2Y] = useState(250 - paddleHeight / 2);
  const [ballX, setBallX] = useState(250);
  const [ballY, setBallY] = useState(250);
  const [ballSpeedX, setBallSpeedX] = useState(5);
  const [ballSpeedY, setBallSpeedY] = useState(5);

  useEffect(() => {
    const canvas = document.getElementById('pongCanvas');
    const context = canvas.getContext('2d');

    const update = () => {
      // Update paddles
      setPaddle1Y((prevY) => Math.max(0, Math.min(prevY, 500 - paddleHeight)));
      setPaddle2Y((prevY) => Math.max(0, Math.min(prevY, 500 - paddleHeight)));

      // Update ball
      setBallX((prevX) => prevX + ballSpeedX);
      setBallY((prevY) => prevY + ballSpeedY);

      // Ball collision with walls
      if (ballY + ballRadius > 500 || ballY - ballRadius < 0) {
        setBallSpeedY((prevSpeed) => -prevSpeed);
      }

      // Ball collision with paddles
      if (
        (ballX - ballRadius < paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) ||
        (ballX + ballRadius > 500 - paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddleHeight)
      ) {
        setBallSpeedX((prevSpeed) => -prevSpeed);
      }

      // Reset ball position if it goes out of bounds
      if (ballX - ballRadius < 0 || ballX + ballRadius > 500) {
        setBallX(250);
        setBallY(250);
      }
    };

    const gameLoop = setInterval(() => {
      update();
      draw(context);
    }, 1000 / 60);

    return () => {
      clearInterval(gameLoop);
    };
  }, [ballX, ballY, ballSpeedX, ballSpeedY, paddle1Y, paddle2Y, paddleHeight]);

  const draw = (context) => {
    // Clear canvas
    context.clearRect(0, 0, 500, 500);

    // Draw paddles
    context.fillStyle = '#fff';
    context.fillRect(10, paddle1Y, paddleWidth, paddleHeight);
    context.fillRect(500 - paddleWidth - 10, paddle2Y, paddleWidth, paddleHeight);

    // Draw ball
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    context.fillStyle = '#fff';
    context.fill();
    context.closePath();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      setPaddle2Y((prevY) => prevY - 10);
    } else if (e.key === 'ArrowDown') {
      setPaddle2Y((prevY) => prevY + 10);
    }
  };

  const handleKeyUp = (e) => {
    // Add more controls if needed
  };

  return (
    <div>
      <canvas
        id="pongCanvas"
        width="500"
        height="500"
        tabIndex="0"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        style={{ border: '2px solid #fff' }}
      ></canvas>
    </div>
  );
};

export default PongGame;
