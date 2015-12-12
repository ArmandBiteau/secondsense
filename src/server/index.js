'use strict';

var http = require('http');
var fs = require('fs');
var io = require("socket.io");
var Game = require("./models/Game");
var Player = require("./models/Player");
var Room = require("./models/Room");

var socket;
var rooms = [];

var room1 = new Room('room1');
var room2 = new Room('room2');

rooms.push(room1);
rooms.push(room2);

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {

    fs.readFile('./index.html', 'utf-8', function(error, content) {

        res.writeHead(200, {'Content-Type': 'text/html'});

        res.end(content);

    });

});

function init() {

    socket = io.listen(server);

    setEventHandlers();

}

function setEventHandlers() {

	socket.sockets.on("connection", onSocketConnection);

};

function onSocketConnection(client) {

	// console.log("New player has connected: "+client.id);
    console.log('Quelqu\'un de nouveau dans le game !');

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

    // Listen for player room
	client.on("switch room", onSwitchRoom);

};

function onClientDisconnect() {

	console.log("Player has disconnected: "+this.player.name);

    var playerToDelete = this.room.players.indexOf(this.player);

    if(playerToDelete != -1) {

    	this.room.players.splice(playerToDelete, 1);

    };

	// Broadcast removed player to connected socket clients
	this.broadcast.emit('remove player', {name: this.player.name});

};

function onNewPlayer(data) {

	this.player = new Player(data.name);

    this.player.id = this.id;

    this.room = roomByName('room1');

    this.join(this.room.name);

    this.room.players.push(this.player);

    console.log(this.player.name+' a rejoint : '+this.room.name);

	this.broadcast.to(this.room.name).emit('new player', {name: this.player.name});

	for (var i = 0; i < this.room.players.length; i++) {

		this.emit('new player', {name: this.room.players[i].name});

	};

    this.emit('update rooms', rooms, this.room);

};

function onSwitchRoom(newroom) {

    this.leave(this.room.name);

    // delete player from the room
    var playerToDelete = this.room.players.indexOf(this.player);

    if(playerToDelete != -1) {

    	this.room.players.splice(playerToDelete, 1);

    };

	this.join(newroom);

	this.room = roomByName(newroom);

    // Add player to the room
    this.room.players.push(this.player);

    console.log(this.player.name+' a rejoint : '+this.room.name);

	this.emit('update rooms', rooms, this.room);

};

function playerById(id) {

	// for (var i = 0; i < this.room.players.length; i++) {
    //
	// 	if (this.room.players[i].id == id)
    //
	// 		return this.room.players[i];
    //
	// };

	return false;

};

function roomByName(roomName) {

	for (var i = 0; i < rooms.length; i++) {

		if (rooms[i].name == roomName)

			return rooms[i];

	};

	return false;

};

function playersByRoom(roomName) {

    this.to(roomName).map(function(e) {

        return e.player;

    });

};

init();

server.listen(3000);

console.log('Server running at http://192.168.33.10:3000/');
