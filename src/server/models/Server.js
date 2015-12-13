'use strict';

var http = require('http');
var fs = require('fs');
var io = require('socket.io');

var Server = function() {

    //My Server

};

Server.prototype.createServer = function() {

    var server = http.createServer(function(req, res) {

        fs.readFile('./index.html', 'utf-8', function(error, content) {

            res.writeHead(200, {'Content-Type': 'text/html'});

            res.end(content);

        });

    });

    return server;

};

module.exports = Server;
