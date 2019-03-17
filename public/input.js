
// Which keys are currently pressed?
var input = {
    up:          false,
    down:        false,
    left:        false,
    right:       false,
    buttons:     [],
    axes:        [],
    mouseLeft:   false,
    mouseMiddle: false,
    mouseRight:  false,
    mouseX:      0,
    mouseY:      0
}

// Handle keydowns
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case "ArrowUp":
            input.up = true;
            break;
        case "ArrowDown":
            input.down = true;
            break;
        case "ArrowLeft":
            input.left = true;
            break;
        case "ArrowRight":
            input.right = true;
            break;
        case " ":
            if (playership.health && started)
                fireTheLaser(playership);
            break;
        case "d":
            console.log("debug")
            break;
    }  
}, false);

// Handle keyups
document.addEventListener('keyup', (event) => {
    switch(event.key) {
        case "ArrowUp":
            input.up = false;
            break;
        case "ArrowDown":
            input.down = false;
            break;
        case "ArrowLeft":
            input.left = false;
            break;
        case "ArrowRight":
            input.right = false;
            break;
    }  
}, false);

// Handle mouse down
document.addEventListener('mousedown', (event) => {
    switch(event.button) {
        case 0:
            input.mouseLeft = true;
            break;
        case 1:
            input.mouseMiddle = true;
            break;
        case 2:
            input.mouseRight = true;
            break;
    }
    // input.mouseX = event.pageX;
    // input.mouseY = event.pageY;
}, false);

// Handle mouse up
document.addEventListener('mouseup', (event) => {
    switch(event.button) {
        case 0:
            input.mouseLeft = false;
            break;
        case 1:
            input.mouseMiddle = false;
            break;
        case 2:
            input.mouseRight = false;
            break;
    }
    // input.mouseX = event.pageX;
    // input.mouseY = event.pageY;
}, false);

// Handle mouse movement
document.addEventListener('mousemove', (event) => {
    input.mouseX = event.pageX;
    input.mouseY = event.pageY;
}, false);

var gp = 0;
window.addEventListener("gamepadconnected", function () {
    gp = navigator.getGamepads()[0];
    console.log("Gamepad " + gp.index + " connected: " + gp.id + ". " + gp.buttons.length + " buttons, " + gp.axes.length + " axes.");

    var gamepadInterval = setInterval(gamepadInput, 16);
});

function gamepadInput() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!gamepads)
        return;

    input.axes = gamepads[0].axes;
    input.buttons = gamepads[0].buttons;

};



