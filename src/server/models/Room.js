'use strict';

var http = require('http');
var fs = require('fs');
var io = require('socket.io');

var Player = require('./Player');

var Room = function(roomName) {

	this.name = roomName;

	this.maxPlayers = 5;

	this.players = [];

};

Room.prototype.join = function(socket) {

	socket.join(this.name);

};

Room.prototype.leave = function(socket) {

	socket.leave(this.name);

};

Room.prototype.addPlayer = function(socket, player) {

    this.join(socket);

    this.players.push(player);

	console.log(player.name+' a rejoint : '+this.name);

	socket.broadcast.to(this.name).emit('new player', {name: player});

	for (var i = 0; i < this.players.length; i++) {

		socket.emit('new player', {name: this.players[i].name});

	};

};

Room.prototype.removePlayer = function(socket, player) {

	this.leave(socket);

	var playerToDelete = this.players.indexOf(player);

    if(playerToDelete != -1) {

    	this.players.splice(playerToDelete, 1);

    };

};

Room.prototype.playerById = function() {

};

module.exports = Room;
