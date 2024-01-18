import React, { useState } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
    const initialBoard = Array(3).fill(Array(3).fill(' '));
  const [board, setBoard] = useState(Array(3).fill(Array(3).fill(' ')));
  const [currentPlayer, setCurrentPlayer] = useState('X');

  const isWinner = (player) => {
    // Check rows, columns, and diagonals
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
        return true;
      }
      if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
        return true;
      }
    }
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
      return true;
    }
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
      return true;
    }
    return false;
  };

  const isBoardFull = () => {
    return board.every(row => row.every(cell => cell !== ' '));
  };

  const getEmptyCells = () => {
    const emptyCells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === ' ') {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    return emptyCells;
  };

  const minimax = (depth, maximizingPlayer) => {
    const scores = {
      X: -1,
      O: 1,
      Tie: 0
    };
  
    if (isWinner('X')) {
      return scores.X;
    } else if (isWinner('O')) {
      return scores.O;
    } else if (isBoardFull()) {
      return scores.Tie;
    }
  
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const cell of getEmptyCells()) {
          board[cell.row][cell.col] = 'O';
          const evaluation = minimax(depth + 1, false);
          board[cell.row][cell.col] = ' ';
          maxEval = Math.max(maxEval, evaluation);
        }
        return maxEval;
      } else {
        let minEval = Infinity;
        for (const cell of getEmptyCells()) {
          board[cell.row][cell.col] = 'X';
          const evaluation = minimax(depth + 1, true);
          board[cell.row][cell.col] = ' ';
          minEval = Math.min(minEval, evaluation);
        }
        return minEval;
      }
      
    
    
  };
  

  const bestMove = () => {
    let bestVal = -Infinity;
    let bestMove;

    for (const cell of getEmptyCells()) {
      board[cell.row][cell.col] = 'O';
      const moveVal = minimax(0, false);
      board[cell.row][cell.col] = ' ';

      if (moveVal > bestVal) {
        bestMove = cell;
        bestVal = moveVal;
      }
    }

    return bestMove;
  };

  const handleClick = (row, col) => {
    if (board[row][col] === ' ' && !isGameOver()) {
      const newBoard = board.map(row => [...row]);
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const isGameOver = () => {
    return isWinner('X') || isWinner('O') || isBoardFull();
  };

  const renderSquare = (row, col) => (
    <button className="square" onClick={() => handleClick(row, col)}>
      {board[row][col]}
    </button>
  );
  const resetGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer('X');
  };
  const renderBoard = () => (
    <div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => renderSquare(rowIndex, colIndex))}
        </div>
      ))}
    </div>
  );

  return (
    <div className='status'>
    <h1><b>Tic Tac Toe</b></h1>
      <div className="status">
        {isGameOver() ? 'Game Over' : `Next player: ${currentPlayer}`}
      </div>
      {renderBoard()}
      {isGameOver() && (
        <div className="game-over">
          {isWinner('X') ? 'X wins!' : isWinner('O') ? 'O wins!' : 'It\'s a tie!'}
          <br></br>
          <button onClick={resetGame}>Replay</button>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
