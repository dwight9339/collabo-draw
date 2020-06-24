const express = require("express");
const app = express();
const socket = require("socket.io");
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
const io = socket(server);
let drawings = {};

const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function createRoomName() {
    let name = "";

    for (let i = 0; i < 10; i++){
        name += symbols[Math.floor(Math.random() * symbols.length)];
    }

    return name;
}

app.get("/", (req, res) => {
    let newRoomName = createRoomName();

    return res.redirect("/" + newRoomName);
});

app.get("/:roomName", (req, res) => {
    res.locals.room = req.params.roomName;

    return res.render("pages/sketchRoom", {"roomName": req.params.roomName});
});

io.sockets.on("connection", socket => {
    console.log("New connection: " + socket.id);
    let room;

    socket.on("join", data => {
        room = data.room;
        if (!drawings[room]){
            drawings[room] = [];
        }
        io.to(socket.id).emit("drawing", {drawing: drawings[room]});

        socket.join(room);
    });

    socket.on("mouse", data => {
        socket.to(room).emit("mouse", data);
        drawings[room].push(data);
    });

    socket.on("disconnect", () => {
        console.log(socket.id + " disconnected");
        socket.leave(room);
    });
});