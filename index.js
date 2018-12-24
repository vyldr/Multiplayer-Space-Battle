const express      = require('express')
const SocketServer = require('ws').Server;
const path         = require('path')
const PORT         = process.env.PORT || 5000

const server = express()
  .use(express.static(path.join(__dirname, 'public')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


// WebSockets!
const wss = new SocketServer({ server });
wss.on('connection', (ws) => {
  playerConnect(ws);
  ws.on('message', (message) => playerUpdate(ws, message));
  ws.on('close', () => playerDisconnect(ws));
});

// Variable to hold the interval for the broadcast 
// function so we can clear it
var broadcastInterval;

// Send the current game state to each client
function broadcast() {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN)
      client.send(JSON.stringify(gameState));
  });
}

var activePlayers = 0;
var gameState = {
  players: [],
  bullets: [],
}

function playerConnect(ws) {
  if (activePlayers == 0)
    broadcastInterval = setInterval(broadcast, 16);

  activePlayers++;
  
  // Add a new player slot if necessary
  if (activePlayers > gameState.players.length) {
    gameState.players.push(0);
  }
  
  // Give the player the lowest available ID
  for (var i = 0; i < gameState.players.length; i++)
    if (gameState.players[i] == 0) {
      gameState.players[i] = 1;
      ws.id = i; // This ID is unique for each player
      break;
    }
    console.log('Player connected ' + ws.id);
}


function playerDisconnect(ws) {
  console.log('Player disconnected ' + ws.id)
  activePlayers--; // Update the number of players
  gameState.players[ws.id] = 0; // Clear the player slot
  
  // The game is empty now
  if (activePlayers == 0)
    cleanup();
}

function playerUpdate(ws, jsonStatus) {
  playerStatus = JSON.parse(jsonStatus);
  gameState.players[ws.id] = playerStatus;
}

function cleanup() {
  // Stop broadcasting
  clearInterval(broadcastInterval);
  
  // Reset the game
  gameState = {
    players: [],
    bullets: [],
  }
}