var express = require('express');
var socket = require('socket.io');
var app = express();

var server = app.listen(3000);
app.use('/app1', express.static('public'))
app.use('/app2', express.static('public2'))

console.log("My server is running");
var io = socket(server);
io.on('connection', newConnection);
const fs = require('fs');
fs.open('mouselog.txt', 'w', function(err, file) {
    if (err) throw err;
    console.log('Saved!');
});


function newConnection(socket) {

    // append_file.js
    // add a line to a lyric file, using appendFile

    console.log('new connection ' + socket.id)
    console.log('connected:', socket.client.id);
    socket.on('mouse', function(data) {
        console.log('new message from client:', data);

        fs.appendFile('mouselog.txt', data.x + ' ' + data.y + ' ' + data.time + '\n', (err) => {
            if (err) throw err;
            console.log('The data were updated!');
        });
        socket.broadcast.emit('mouse', data)
    });
    // setInterval(function() {
    //     socket.emit('clientEvent', Math.random());
    //     console.log('message sent to the clients');
    // }, 3000);
    // console.log(socket)
}