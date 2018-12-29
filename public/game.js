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

// Set up our constants
const worldWidth    = 3840;
const worldHeight   = 2160;
const acceleration  = 0.08;
const shipSize      = 12;
const interval      = 1000;
const laserLifetime = 200;
const hitbox        = 16;

// The main game window
var canvas = document.getElementById('canvas').getContext('2d');
var   windowWidth   = window.innerWidth;
var   windowHeight  = window.innerHeight;

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
};

// Stars for the background
var stars = [];
for (var i = 0; i < 1000; i++) {
    var rand = Math.random() ** 2;
    var star = {
        x: Math.random() * worldWidth,
        y: Math.random() * worldHeight,
        z: rand,
        color: 'rgb(' + 
            Math.floor((Math.random() * 100 + 155) * rand) + ',' +
            Math.floor((Math.random() * 100 + 155) * rand) + ',' +
            Math.floor((Math.random() * 100 + 155) * rand) + ')'
    };
    stars.push(star);
}
// For calculating the star's positions
var xstar = -10000000;  // These numbers are super big because of the problem 
var ystar = -10000000;  // with the modulus operator and negative numbers

// Which keys are currently pressed?
var currentKeys = {
    up:    false,
    down:  false,
    left:  false,
    right: false
}

// Set the canvas size
function resize() {
    windowWidth  = window.innerWidth;
    windowHeight = window.innerHeight;

    document.getElementById("canvas").width  = windowWidth;
    document.getElementById("canvas").height = windowHeight;
}

// Redraw the frame
function draw() {
    
    // Clear the background
    canvas.resetTransform();
    canvas.fillStyle = "#000";
    canvas.fillRect(0, 0, worldWidth, worldHeight);

    // Set the font for player names
    canvas.font = "bold 12px sans-serif";

    // Draw the stars
    stars.forEach(function(star) {
        canvas.fillStyle = star.color; 
        canvas.fillRect(
            (star.x - xstar * star.z / 4) % windowWidth,
            (star.y - ystar * star.z / 4) % windowHeight,
             2, 2);
    });
    
    // Stop here if there is no data from the server yet
    if (gameState.players == undefined)
    return;

    // Move the player's ship to the center
    moveWindow();


    // Draw all other ships
    gameState.players.forEach((element) => {
        // Skip our own ship
        if (element.name != playership.name)
        drawspaceship(element); 
    });

    // Draw the lasers
    canvas.fillStyle = "#ff0000";
    lasers.forEach((laser) => {
        if (laser.age >= laserLifetime)
            return;
        canvas.translate(laser.x, laser.y);
        canvas.rotate(laser.angle)
        canvas.fillRect(0, 0, 24, 2);
        moveWindow();
    });
        
    // draw the ship
    if (playership.health)
        drawspaceship(playership);
}

// Move the window to center the player
function moveWindow() {
    canvas.resetTransform();
    canvas.translate(windowWidth / 2 - playership.x,
                     windowHeight / 2 - playership.y)
}

// Draw a ship as a triangle with each vertex as a point on a circle around
// the ship's position
function drawspaceship(ship) {
    canvas.fillStyle = ship.color;
    canvas.fillText(ship.name, ship.x + 16, ship.y + 4)
    canvas.beginPath();
    canvas.moveTo(ship.x + shipSize * Math.cos(ship.angle), 
                  ship.y + shipSize * Math.sin(ship.angle));
    canvas.lineTo(ship.x + shipSize * Math.cos(ship.angle + 2.5), 
                  ship.y + shipSize * Math.sin(ship.angle + 2.5));
    canvas.lineTo(ship.x + shipSize * Math.cos(ship.angle - 2.5), 
                  ship.y + shipSize * Math.sin(ship.angle - 2.5));
    canvas.fill();
}

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

// Handle keydowns
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case "ArrowUp":
            currentKeys.up = true;
            break;
        case "ArrowDown":
            currentKeys.down = true;
            break;
        case "ArrowLeft":
            currentKeys.left = true;
            break;
        case "ArrowRight":
            currentKeys.right = true;
            break;
        case " ":
            if (playership.health)
                fireTheLaser(playership);
            break;
        case "d":
    }  
}, false);

// Handle keyups
document.addEventListener('keyup', (event) => {
    switch(event.key) {
        case "ArrowUp":
            currentKeys.up = false;
            break;
        case "ArrowDown":
            currentKeys.down = false;
            break;
        case "ArrowLeft":
            currentKeys.left = false;
            break;
        case "ArrowRight":
            currentKeys.right = false;
            break;
    }  
}, false);

// Advance the game one frame
function advance() {

    // Accelerate!
    if (currentKeys.up) {
        playership.vx += acceleration * Math.cos(playership.angle);
        playership.vy += acceleration * Math.sin(playership.angle);
    }

    // Rotate
    if (currentKeys.left)
        playership.angle -= 0.1;
    if (currentKeys.right)
        playership.angle += 0.1;
    
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

