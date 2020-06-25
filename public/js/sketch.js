let socket;
let colorPicker;
let radiusSlider;
let eraserButton;
let erasing;
let backgroundColor = "rgb(255, 255, 255)";

function setup() {
    let room = window.location.pathname.split("/").filter(str => str.length > 0)[0];
    let hostName = window.location.protocol + "//" + window.location.host;

    let canvas = createCanvas(500, 500);
    canvas.parent("#sketch");
    background(color(backgroundColor));

    colorPicker = createColorPicker("#000000");
    colorPicker.parent("#colorPickerDiv");
    colorPicker.id("colorPicker");

    radiusSlider = createSlider(10, 50, 30);
    radiusSlider.parent("#radiusSliderDiv");
    radiusSlider.id("radiusSlider");

    eraserButton = createButton("Erase");
    eraserButton.parent("#eraserDiv");
    eraserButton.mousePressed(() => {erasing = !erasing});

    socket = io.connect(hostName);

    socket.on("connect", () => {
        socket.emit("join", { room });
    })

    socket.on("drawing", data => {
        data.drawing.forEach(point => {
            noStroke();
            fill(color(point.color));
            circle(point.x, point.y, point.radius);
        });
    });

    socket.on("mouse", data => {
        noStroke();
        fill(color(data.color));
        circle(data.x, data.y, data.radius);
    });
}

function mouseDragged() {
    let data = {
        x: mouseX,
        y: mouseY,
        color: erasing ? backgroundColor : colorPicker.color().toString(),
        radius: radiusSlider.value()
    }
    socket.emit("mouse", data);

    noStroke();
    fill(erasing ? color(backgroundColor) : colorPicker.color());
    circle(mouseX, mouseY, radiusSlider.value());
}

function touchMoved() {
    let data = {
        x: mouseX,
        y: mouseY,
        color: erasing ? backgroundColor : colorPicker.color().toString(),
        radius: radiusSlider.value()
    }
    socket.emit("mouse", data);

    noStroke();
    fill(erasing ? color(backgroundColor) : colorPicker.color());
    circle(mouseX, mouseY, radiusSlider.value());
}

function draw() {
    if (erasing) {
        eraserButton.style("filter", "brightness(50%)");
        cursor("images/eraser.cur");
    } else {
        eraserButton.style("filter", "brightness(100%)");
        cursor("images/pencil.cur");
    }
}