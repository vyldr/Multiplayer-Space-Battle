// Set the canvas size
function resize() {
    windowWidth  = window.innerWidth;
    windowHeight = window.innerHeight;

    document.getElementById("canvas").width  = windowWidth;
    document.getElementById("canvas").height = windowHeight;
}

// Move the window to center the player so we don't get lost
function moveWindow() {
    canvas.resetTransform();
    canvas.translate(windowWidth  / 2 - playership.x,
                     windowHeight / 2 - playership.y)
}

// Draw a ship as a triangle with each vertex as a point on a circle around
// the ship's position
function drawspaceship(ship) {
    canvas.fillStyle = ship.color;

    // Draw the ships in their own location and in eight parallel universes
    for (var i = -1; i <= 1; i++)
        for (var j = -1; j <= 1; j++) {
            canvas.fillText(ship.name, ship.x + 16 + worldWidth * i, ship.y + 4 + worldHeight * j);
            canvas.beginPath();
            canvas.moveTo(ship.x + worldWidth  * i + shipSize * Math.cos(ship.angle), 
                          ship.y + worldHeight * j + shipSize * Math.sin(ship.angle));
            canvas.lineTo(ship.x + worldWidth  * i + shipSize * Math.cos(ship.angle + 2.5), 
                          ship.y + worldHeight * j + shipSize * Math.sin(ship.angle + 2.5));
            canvas.lineTo(ship.x + worldWidth  * i + shipSize * Math.cos(ship.angle - 2.5), 
                          ship.y + worldHeight * j + shipSize * Math.sin(ship.angle - 2.5));
            canvas.fill();
        }
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
        for (var i = -1; i <= 1; i++)
            for (var j = -1; j <= 1; j++) {
                canvas.translate(laser.x + worldWidth * i, laser.y + worldHeight * j);
                canvas.rotate(laser.angle)
                canvas.fillRect(0, 0, 24, 2);
                moveWindow();
            }
    });
        
    // draw the ship
    if (playership.health)
        drawspaceship(playership);
}

