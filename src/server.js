'use strict';

console.log('Server works !');

var fs = require('fs');
function handler(req, res) {
    fs.readFile(__dirname + '/index.php',
    function(err, data) {
        if (err) {
          res.writeHead(500);
          return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    });
}

var app = require('http').createServer(handler);

var io = require('socket.io')(app);

app.listen(8000);

io.on('connection', function(socket) {

    console.log('connection');

    socket.emit('news', { hello: 'world' });

    socket.on('my other event', function(data) {

        console.log(data);

    });

});
