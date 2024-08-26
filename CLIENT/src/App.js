import React, { useState, useEffect } from 'react';

const App = () => {
  const [board, setBoard] = useState(Array.from({ length: 5 }, () => Array(5).fill(null)));
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Create a new WebSocket connection when the component mounts
    const socket = new WebSocket('ws://localhost:4000');

    // Set up event listeners for WebSocket
    socket.onopen = () => {
      console.log('Connected to the server');
      setWs(socket); // Save the WebSocket connection to state
    };

    socket.onmessage = (event) => {
      const gameState = JSON.parse(event.data);
      setBoard(gameState.board); // Update the game board with data from the server
    };

    socket.onclose = () => {
      console.log('Disconnected from the server');
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  // Function to handle click events on the board
  const handleClick = (rowIndex, colIndex) => {
    if (ws) {
      // Send the move to the server via WebSocket
      ws.send(JSON.stringify({ row: rowIndex, col: colIndex }));
    }
  };

  return (
    <div className="game-container">
      <h1>Chess-like Game</h1>
      <div className="game-board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}  
              className="cell"
              onClick={() => handleClick(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
