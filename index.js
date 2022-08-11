const express = require("express");
const app = express();
const socket = require("socket.io");
const path = require("path");
const { randomBytes } = require("crypto");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
const io = socket(server);
const drawings = {};
const rooms = {};

const createRoomName = () => {
  return randomBytes(6)
    .toString("base64")
    .replace("+", "_")
    .replace("/", "-");
}

app.get("/", (req, res) => {
    let newRoomName = createRoomName();
    console.log(`New room name: ${newRoomName}`);

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

        if (!rooms[room]){
            rooms[room] = 1;
        } else {
            rooms[room] += 1;
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
        rooms[room] -= 1;
        if (rooms[room] === 0){
            drawings[room] = [];
        }

        socket.leave(room);
    });
});