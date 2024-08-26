const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let gameState = {
    board: Array(5).fill().map(() => Array(5).fill(null)),
    currentPlayer: 'X'
};

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    ws.on('message', (message) => {
        const move = JSON.parse(message);
        const { row, col } = move;

        if (gameState.board[row][col] === null) {
            gameState.board[row][col] = gameState.currentPlayer;
            gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        }

        // Broadcast the new game state to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(gameState));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.use(express.static('public'));

server.listen(8080, () => {
    console.log('Server is running on http://localhost:4000');
});