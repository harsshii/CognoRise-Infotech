// App.js
import React from 'react';
import './App.css';
import PongGame from './PongGame';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Ping Pong Game</h1>
        <PongGame />
      </header>
    </div>
  );
}

export default App;
