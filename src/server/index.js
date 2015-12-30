'use strict';

let test = 20;
console.log(test);

var http = require('http');
var fs = require('fs');
var io = require('socket.io');

var server = new (require('./models/Server'))().createServer();

var socket;

var Game = require('./models/Game');
var Player = require('./models/Player');

var SecondSense = new Game();

SecondSense.addRoom('Temporary room');
SecondSense.addRoom('Another room');


function init() {

    socket = io.listen(server);

    setEventHandlers();

}

function setEventHandlers() {

	socket.sockets.on('connection', onSocketConnection);

};

function onSocketConnection(client) {

	// console.log("New player has connected: "+client.id);
    console.log('Quelqu\'un de nouveau dans le game !');

	// Listen for client disconnected
	client.on('disconnect', onClientDisconnect);

	// Listen for new player message
	client.on('new player', onNewPlayer);

    // Listen for player room
	client.on('switch room', onSwitchRoom);

};

function onClientDisconnect() {

    if (this.player) {

        console.log('Player has disconnected: '+this.player.name);

        var playerToDelete = this.room.players.indexOf(this.player);

        if(playerToDelete != -1) {

        	this.room.players.splice(playerToDelete, 1);

        };

    	this.broadcast.emit('remove player', {name: this.player.name});

    } else {

        console.log('Unknown player has disconnected !');

    };

};

function onNewPlayer(data) {

    this.player = new Player(data.name);

    this.room = SecondSense.roomByName('Temporary room');

    this.room.addPlayer(this, this.player);

    SecondSense.updateRooms(this);

};

function onSwitchRoom(newroom) {

    this.room.removePlayer(this, this.player);

    this.room = SecondSense.roomByName(newroom);

    this.room.addPlayer(this, this.player);

    SecondSense.updateRooms(this);

};


init();

server.listen(3000);

console.log('Server running at http://192.168.33.10:3000/');
