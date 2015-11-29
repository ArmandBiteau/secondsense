'use strict';

var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {

    fs.readFile('./index.html', 'utf-8', function(error, content) {

        res.writeHead(200, {'Content-Type': 'text/html'});

        res.end(content);

    });

});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand on client se connecte, on le note dans la console
io.sockets.on('connection', function() {

    console.log('Quelqu\'un de nouveau dans le game !');

});

io.sockets.on('connection', function(socket) {

    socket.emit('message', 'T\'es dans le game !');

    socket.on('nouveau_gamer', function(gamer) {

        socket.gamer = gamer;

        socket.broadcast.emit('message', socket.gamer.name+' est entré dans le game !');

    });

    socket.on('message', function(message) {

        // On récupère le pseudo de celui qui a cliqué dans les variables de session
        console.log(socket.gamer.name + ' est bavard ! ' + message);

    });

});

server.listen(3000);

console.log('Server running at http://192.168.33.10:3000/');
