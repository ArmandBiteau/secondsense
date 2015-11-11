'use strict';

console.log('Server works !');

var io = require('socket.io').listen(5000);

io.sockets.on('connection', function() {

    console.log('connection !');

});
