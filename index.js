const express = require("express");
const app = express();
const socket = require("socket.io");


app.use(express.static("public"));

const PORT = 3000;
const server = app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
const io = socket(server);

io.sockets.on("connection", socket => {
    console.log("New connection: " + socket.id);

    socket.on("mouse", data => {
        socket.broadcast.emit("mouse", data);
        console.log(data);
    });

    socket.on("disconnect", () => {
        console.log(socket.id + " disconnected");
    });
});