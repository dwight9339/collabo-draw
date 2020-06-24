let socket;
let colorPicker;
let radiusSlider;
let eraserButton;
let erasing;
let backgroundColor = "rgb(255, 255, 255)";

function setup() {
    createCanvas(500, 500);
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

    socket = io.connect("http://localhost:3000");
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

function draw() {

}