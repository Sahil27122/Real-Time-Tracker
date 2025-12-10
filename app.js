const express = require('express');
const app = express();

const path = require("path");

// Socket.io runs on http server
const http = require('http');

const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

// Ejs setup
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Connection req handle here
io.on("connection", function(socket){

    // Event accept here
    socket.on("send-location", function(data) {
        // send or return to frontend to everyone
        io.emit("receive-location", {id: socket.id, ...data});
    });

    socket.on("disconnect", function(){
        io.emit("user-disconnected", socket.id);
    });

    console.log("connected");
})

app.get("/", function(req, res){
    res.render("index");
})

server.listen(3000);