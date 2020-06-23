let socket;

function setup() {
    createCanvas(800, 800);
    background(220);
    socket = io.connect("http://localhost:3000");
    socket.on("mouse", data => {
        noStroke();
        fill(0);
        ellipse(data.x, data.y, 20, 20);
    });
}

function mouseDragged() {
    let data = {
        x: mouseX,
        y: mouseY
    }
    socket.emit("mouse", data);

    noStroke();
    fill(0);
    ellipse(mouseX, mouseY, 20, 20);
}

function draw() {
    
}