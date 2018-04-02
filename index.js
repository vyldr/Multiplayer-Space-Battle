const express      = require('express')
const SocketServer = require('ws').Server;
const path         = require('path')
const PORT         = process.env.PORT || 5000

const server = express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });
wss.on('connection', (ws) => {
  playerConnect(ws);
  ws.on('message', (message) => playerUpdate(ws, message));
  ws.on('close', () => playerDisconnect(ws));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(gameState));
  });
}, 1000);

activePlayers = 0;

gameState = {
  players: [],
  bullets: [],
}

function playerConnect(ws) {
  activePlayers++;
  
  // Add a new player slot if necessary
  if (activePlayers > gameState.players.length) {
    gameState.players.push(0);
  }
  
  // Give the player the lowest available ID
  for (var i = 0; i < gameState.players.length; i++)
    if (gameState.players[i] == 0) {
      gameState.players[i] = 1;
      ws.id = i;
      break;
    }
  console.log('Client connected ' + ws.id);
}


function playerDisconnect(ws) {
  console.log('Client disconnected ' + ws.id)
  activePlayers--; // Update the number of players
  gameState.players[ws.id] = 0; // Clear the player slot
}

function playerUpdate(ws, jsonStatus) {
  playerStatus = JSON.parse(jsonStatus);
  gameState.players[ws.id] = playerStatus;
}

