'use strict';

console.log('Server works !');

var io = require('socket.io').listen(5000);

io.sockets.on('connection', function(socket) {

    console.log('connection !');

    socket.on('set nickname', function(name) {

        socket.set('nickname', name, function() {

            socket.emit('ready');

        });

    });

    socket.on('msg', function() {

        socket.get('nickname', function(err, name) {

            console.log('Chat message by ', name);

        });

    });

});
