    // Set up our variables
    var robot = {
        name:"asdf",
        x: Math.floor(window.innerWidth / 2) + 20,
        y: Math.floor(window.innerHeight / 2) + 20,
        vx: 0,
        vy: 0,
        angle: Math.PI * 1.5
    };
    var boxWidth;
    var boxHeight;
    var step = 0.1;
    var robotSize = 20;
    var interval = 1000;
    var commands = "";
    var commandlist = [];
    var canvas = document.getElementById('canvas').getContext('2d');
    var currentKeys = {
        up:false,
        down:false,
        left:false,
        right:false
    }
    
    // Make sure everything fits when we resize the window
    function resize() {
        boxWidth = window.innerWidth;
        boxHeight = window.innerHeight;
        document.getElementById("canvas").width = window.innerWidth;
        document.getElementById("canvas").height = window.innerHeight;
    }    

    // Redraw the frame
    function draw() {
        
        // Clear the background
        canvas.fillStyle = "#000";
        canvas.fillRect(0, 0, boxWidth, boxHeight);
        
        // draw the robot
        canvas.fillStyle = "#3bc";
        drawspaceship();
        // canvas.fillRect((robot.x - robotSize / 2) % (boxWidth + robotSize)
        //     - robotSize, (robot.y - robotSize / 2) % (boxHeight + robotSize)
        //     - robotSize, robotSize, robotSize);
    }

    function drawspaceship() {
        canvas.beginPath();
        canvas.moveTo(robot.x + 10 * Math.cos(robot.angle), robot.y + 10 * Math.sin(robot.angle));
        canvas.lineTo(robot.x + 10 * Math.cos(robot.angle + 2.5), robot.y + 10 * Math.sin(robot.angle + 2.5));
        canvas.lineTo(robot.x + 10 * Math.cos(robot.angle - 2.5), robot.y + 10 * Math.sin(robot.angle - 2.5));
        canvas.fill();
    }
      

    // Get the new commands
    function update() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            commands = this.responseText;
            commandlist = commandlist.concat(commands.split(""));
        };
        xhttp.open("GET", "getInput.php?name=" + robotName, true);
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

    // Move the robot with commands from the server
    function move() {
        if (currentKeys.up) {
            robot.vx += step * Math.cos(robot.angle);
            robot.vy += step * Math.sin(robot.angle);
        }
        if (currentKeys.down) {
            robot.vx -= step * Math.cos(robot.angle);
            robot.vy -= step * Math.sin(robot.angle);
        }
        if (currentKeys.left)
            robot.angle -= 0.1;
        if (currentKeys.right)
            robot.angle += 0.1;
        
        robot.x += robot.vx;
        robot.y += robot.vy;
        draw();
    }

    // Start the repeating functions
    // setInterval(update, interval);
    setInterval(move, 17)

    // Set the initial size
    resize();

