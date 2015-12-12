'use strict';

var http = require('http');
var fs = require('fs');
var io = require('socket.io');

var Room = require('./Room');

var Game = function() {

    this.rooms = [];

};

Game.prototype.addRoom = function(roomName) {

    this.rooms.push(new Room(roomName));

};

Game.prototype.removeRoom = function(room) {

	var roomToDelete = this.rooms.indexOf(room);

    if(roomToDelete != -1) {

    	this.rooms.splice(roomToDelete, 1);

    };

};

Game.prototype.updateRooms = function(socket) {

    socket.emit('update rooms', this.rooms);

};

Game.prototype.roomByName = function(roomName) {

	for (var i = 0; i < this.rooms.length; i++) {

		if (this.rooms[i].name == roomName)

			return this.rooms[i];

	};

	return false;

};


module.exports = Game;
