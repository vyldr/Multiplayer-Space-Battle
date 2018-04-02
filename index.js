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
  console.log('Client connected');
  ws.on('message', (message) => console.log(message));
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(global.gameState));
  });
}, 1000);


global.gameState = {
  players: [],
  bullets: [],
}

// .players = [];
// global.gameState.bullets = [];

