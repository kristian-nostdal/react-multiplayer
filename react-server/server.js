const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

// our localhost port
const port = 4001

const app = express()

// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)

const SOCKET_LIST = {};

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
    console.log('New client connected')
    socket.id = Math.random();
    socket.x = 0;
    socket.y = 0;

    SOCKET_LIST[socket.id] = socket;


    socket.on('change color', (color) => {
        console.log('Color Changed to: ', color)
        io.sockets.emit('change color', color)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

setInterval(() =>{
    for(const i in SOCKET_LIST){
        const socket = SOCKET_LIST[i];
        socket.x++;
        socket.y++;
        socket.emit('newPosition',{
            x:socket.x,
            y:socket.y
        })
    }
},1000/25)

server.listen(port, () => console.log(`Listening on port ${port}`))