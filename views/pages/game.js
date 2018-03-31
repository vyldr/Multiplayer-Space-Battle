    // Set up our variables
    var boxWidth = 1920;
    var boxHeight = 1079;
    var step = 0.1;
    var shipSize = 10;
    var interval = 1000;
    var commands = "";
    var commandlist = [];
    var canvas = document.getElementById('canvas').getContext('2d');
    var ship = {
        name:"asdf",
        x: Math.floor(boxWidth / 2) + 20,
        y: Math.floor(boxHeight / 2) + 20,
        vx: 0,
        vy: 0,
        angle: Math.PI * 1.5
    };
    var currentKeys = {
        up:false,
        down:false,
        left:false,
        right:false
    }
    
    // Set the canvas size
    document.getElementById("canvas").width = boxWidth;
    document.getElementById("canvas").height = boxHeight;

    // Redraw the frame
    function draw() {
        
        // Clear the background
        canvas.fillStyle = "#000";
        canvas.fillRect(0, 0, boxWidth, boxHeight);
        
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
      

    // Get the new commands
    function update() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            commands = this.responseText;
            commandlist = commandlist.concat(commands.split(""));
        };
        xhttp.open("GET", "getInput.php?name=" + shipName, true);
        xhttp.send();
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
            ship.vx += step * Math.cos(ship.angle);
            ship.vy += step * Math.sin(ship.angle);
        }

        // Rotate
        if (currentKeys.left)
            ship.angle -= 0.1;
        if (currentKeys.right)
            ship.angle += 0.1;
        
        // Update position
        ship.x += ship.vx;
        ship.y += ship.vy;

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
    setInterval(move, 17)


