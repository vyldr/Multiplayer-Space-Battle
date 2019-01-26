// Set up the WebSocket
var HOST = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(HOST);
var updateInterval = 1000;
ws.onmessage = function (event) {
    gameState = JSON.parse(event.data);
};


// Everything that is happening now
var gameState  = {};
var lasers     = [];
var shotsTaken = 0;

// Have we started?
var started = false;

// The main game window
var canvas       = document.getElementById('canvas').getContext('2d');
var windowWidth  = window.innerWidth;
var windowHeight = window.innerHeight;

// Set up our constants
const worldWidth    = 7680;
const worldHeight   = 4320;
const acceleration  = 0.08;
const shipSize      = 12;
const interval      = 1000;
const laserLifetime = 200;
const hitbox        = 16;

// The player object
var playership = {
    name:   '',
    color:  '#3BC',
    // position
    x:      Math.floor(worldWidth / 2),
    y:      Math.floor(worldHeight / 2),
    angle:  Math.PI * 1.5,
    // velocity
    vx:     0,
    vy:     0,
    // lasers
    laser:  false,
    firing: false,

    health: 10,
    laserHold: false,
};

// Stars for the background
var stars = [];
for (var i = 0; i < 1000; i++) {
    var depth = (i / 1000) ** 2;
    var star = {
        x: Math.random() * worldWidth,
        y: Math.random() * worldHeight,
        z: depth,
        color: 'rgb(' + 
            Math.floor((Math.random() * 100 + 155) * depth) + ',' +
            Math.floor((Math.random() * 100 + 155) * depth) + ',' +
            Math.floor((Math.random() * 100 + 155) * depth) + ')'
    };
    stars.push(star);
}
// For calculating the star's positions
var xstar = -10000000;  // These numbers are super big because of the problem 
var ystar = -10000000;  // with the modulus operator and negative numbers

// Fire the laser!
function fireTheLaser(ship) {
    ship.firing = true;
    lasers.push({
        x:     ship.x,
        y:     ship.y,
        vx:    ship.vx + 4 * Math.cos(ship.angle),
        vy:    ship.vy + 4 * Math.sin(ship.angle),
        angle: ship.angle,
        id:    ship.name,
        age:   0,
    });
}

function takeDamage() {
    if (playership.health > 0)
        playership.health --;
    if (playership.health == 0) {
        location.reload();
    }
    console.log('damage');
    
}

// Advance the game one frame
function advance() {

    // Accelerate!
    if (input.up || (input.buttons[1].pressed)) {
        playership.vx += acceleration * Math.cos(playership.angle);
        playership.vy += acceleration * Math.sin(playership.angle);
    }

    // Rotate
    if (input.left)
        playership.angle -= 0.1;
    if (input.right)
        playership.angle += 0.1;

    // Gamepad rotate
    if (input.axes.length > 0)
        if (Math.sqrt(input.axes[0] ** 2 + input.axes[1] ** 2) > 0.1)
            playership.angle = Math.atan2(input.axes[1], input.axes[0]);

    // Gamepad Lasers
    if (!input.buttons[7].pressed)
        playership.laserHold = false;
    if (input.buttons[7].pressed && !playership.laserHold) {
        fireTheLaser(playership);
        playership.laserHold = true; // Don't allow continuous firing
    }
    
    // Update position
    playership.x += playership.vx;
    playership.y += playership.vy;

    // Update position for stars
    xstar += playership.vx;
    ystar += playership.vy;

    // Edge looping
    if (playership.x > worldWidth)
        playership.x -= worldWidth;
    if (playership.x < 0)
        playership.x += worldWidth;
    if (playership.y > worldHeight)
        playership.y -= worldHeight;
    if (playership.y < 0)
        playership.y += worldHeight;

    // Update lasers
    lasers.forEach((laser) => {
        laser.x += laser.vx;
        laser.y += laser.vy;

        // looping
        if (laser.x > worldWidth)
            laser.x -= worldWidth;
        if (laser.x < 0)
            laser.x += worldWidth;
        if (laser.y > worldHeight)
            laser.y -= worldHeight;
        if (laser.y < 0)
            laser.y += worldHeight;

        laser.age++;
        
    });

    // Remove old lasers
    if (lasers.length >= 1)
        if (lasers[0].age > laserLifetime)
            lasers.shift();

    // Add new lasers
    gameState.players.forEach((player) => {
        if (player.firing && player.name != playership.name)
            fireTheLaser(player);
    })

    // Laser collision
    for (var i = 0; i < gameState.players.length; i++)
        for (var j = 0; j < lasers.length; j++) {
            // calculate the hitbox
            if (Math.abs(gameState.players[i].x - lasers[j].x) < hitbox && 
                Math.abs(gameState.players[i].y - lasers[j].y) < hitbox && 
                // We don't want to hit ourselves
                gameState.players[i].name != playership.name &&
                gameState.players[i].name != lasers[j].id) {
                    console.log('hit');
                    lasers[j].age = laserLifetime;
            }
        }
    
    // Take damage
    for (var j = 0; j < lasers.length; j++) {
        if (Math.abs(playership.x - lasers[j].x) < hitbox && 
            Math.abs(playership.y - lasers[j].y) < hitbox && 
            lasers[j].id != playership.name &&
            lasers[j].age < laserLifetime) {
                takeDamage();
                lasers[j].age = laserLifetime;
            }
    }
    
    draw();
}

function startGame() {
    if (!(document.getElementById('setup').reportValidity()))
        return false;
    // Hide the setup window
    document.getElementById('setup').style = "display: none;";

    // Apply the chosen name and color
    playership.name = document.getElementById('playerName').value;
    playership.color = document.getElementById('color').value;

    // This will be taken over by advance()
    clearInterval(previewDraw);

    // Start sending data to the server
    setInterval(() => { 
        ws.send(JSON.stringify(playership));
        playership.firing = false; 
    }, 16);
    
    advanceInterval = setInterval(advance, 16)

    started = true;

}

var previewDraw = setInterval(draw, 16);
var advanceInterval;

