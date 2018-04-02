// Set up the WebSocket
var HOST = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(HOST);
var updateInterval = 1000;
ws.onmessage = function (event) {
    gameState = JSON.parse(event.data);
};
setTimeout(() => { ws.send(JSON.stringify(ship)); }, 2000);

// Everything that is happening now
var gameState = {};

// Set up our constants
const boxWidth = 1280;
const boxHeight = 768;
const acceleration = 0.05;
const shipSize = 10;
const interval = 1000;

// The main game window
var canvas = document.getElementById('canvas').getContext('2d');

// The player object
var ship = {
    name: 'Spaceship:' + Math.floor(Math.random() * 10000),
    // position
    x: Math.floor(boxWidth / 2),
    y: Math.floor(boxHeight / 2),
    angle: Math.PI * 1.5,
    // velocity
    vx: 0,
    vy: 0,
};

// Stars for the background
var stars = [];
for (var i = 0; i < 1000; i++) {
    var star = {
        x: Math.random() * boxWidth,
        y: Math.random() * boxHeight,
        z: Math.random() ** 2,
        r: Math.random() * 80 + 175,
        g: Math.random() * 80 + 175,
        b: Math.random() * 80 + 175,
    };
    stars.push(star);
}
// For calculating the star's positions
var xstar = -10000000; // These numbers are super big because of the problem 
var ystar = -10000000;  // with the modulus operator and negative numbers

// Which keys are currently pressed?
var currentKeys = {
    up:    false,
    down:  false,
    left:  false,
    right: false
}

// Set the canvas size
document.getElementById("canvas").width = boxWidth;
document.getElementById("canvas").height = boxHeight;

// Redraw the frame
function draw() {
    
    // Clear the background
    canvas.fillStyle = "#000";
    canvas.fillRect(0, 0, boxWidth, boxHeight);

    // draw the stars
    stars.forEach(function(star) {
        canvas.fillStyle = "rgba(" + star.r +", " + star.g + ", " + star.b + ", " + star.z +")";
        canvas.fillRect(
            (star.x - xstar * star.z / 4) % boxWidth,
            (star.y - ystar * star.z / 4) % boxHeight,
             2, 2);
      });
    
    // draw the ship
    canvas.fillStyle = "#3bc";
    drawspaceship();
}

function drawspaceship() {
    canvas.beginPath();
    canvas.moveTo(ship.x + shipSize * Math.cos(ship.angle), ship.y + shipSize * Math.sin(ship.angle));
    canvas.lineTo(ship.x + shipSize * Math.cos(ship.angle + 2.5), ship.y + shipSize * Math.sin(ship.angle + 2.5));
    canvas.lineTo(ship.x + shipSize * Math.cos(ship.angle - 2.5), ship.y + shipSize * Math.sin(ship.angle - 2.5));
    canvas.fill();
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

// Move the ship with commands from the server
function move() {

    // Accelerate!
    if (currentKeys.up) {
        ship.vx += acceleration * Math.cos(ship.angle);
        ship.vy += acceleration * Math.sin(ship.angle);
    }

    // Rotate
    if (currentKeys.left)
        ship.angle -= 0.1;
    if (currentKeys.right)
        ship.angle += 0.1;
    
    // Update position
    ship.x += ship.vx;
    ship.y += ship.vy;

    // Update position for stars
    xstar += ship.vx;
    ystar += ship.vy;

    // Edge looping
    if (ship.x > boxWidth)
        ship.x -= boxWidth;
    if (ship.x < 0)
        ship.x += boxWidth;
    if (ship.y > boxHeight)
        ship.y -= boxHeight;
    if (ship.y < 0)
        ship.y += boxHeight;
    

    draw();
}

// Start the repeating functions
// setInterval(update, interval);
setInterval(move, 20)


