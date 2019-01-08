var express = require('express');
var socket = require('socket.io');
var app = express();

var server = app.listen(3000);
app.use('/app1', express.static('public'))
app.use('/app2', express.static('public2'))

console.log("My server is running");
var io = socket(server);
io.on('connection', newConnection);

function newConnection(socket) {
    console.log('new connection ' + socket.id)
    console.log('connected:', socket.client.id);
    socket.on('mouse', function(data) {
        console.log('new message from client:', data);
        socket.broadcast.emit('mouse', data)
    });
    // setInterval(function() {
    //     socket.emit('clientEvent', Math.random());
    //     console.log('message sent to the clients');
    // }, 3000);
    // console.log(socket)
}