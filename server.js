var express = require('express');
var socket = require('socket.io');
var app = express();
var port = 3000;
var server = app.listen(port);
// server runs at https://localhost:3000

//App A is is in AppA Folder, App B is in AppB folder 
app.use('/app1', express.static('AppA'))
app.use('/app2', express.static('AppB'))
console.log("Server is running at port " + port);

//initialize websocket with socket.io
var io = socket(server);
io.on('connection', newConnection);

//create a new text file called "mouselog.txt" for storing client data from App A
const fs = require('fs');
fs.open('mouselog.txt', 'w', function(err, file) {
    if (err) throw err;
    console.log('Text File Created!');
});


function newConnection(socket) {
    //showing new connection id 
    console.log('new connection ' + socket.id)

    //writing data to text file and broadcasting data to App B
    socket.on('mouseMovePoint', function(data) {
        console.log('new message from App A:', data);

        fs.appendFile('mouselog.txt', data.x + ' ' + data.y + ' ' + data.time + '\n', (err) => {
            if (err) throw err;
            console.log('The data were updated!');
        });
        socket.broadcast.emit('mouseMovePoint', data)
    });

    socket.on('replayPoint', function(data) {
        console.log('new message from App B:', data);
        var fs = require('fs');
        var sendArray = []
        fs.readFile('mouselog.txt', function(err, data) {
            if (err) throw err;
            var array = data.toString().split("\n");
            for (i in array) {
                console.log(array[i]);
            }
            io.sockets.emit('replayData', array)

        });



        // fs.appendFile('mouselog.txt', data.x + ' ' + data.y + ' ' + data.time + '\n', (err) => {
        //     if (err) throw err;
        //     console.log('The data were updated!');
        // });
        // socket.broadcast.emit('mouseMovePoint', data)
    });


}