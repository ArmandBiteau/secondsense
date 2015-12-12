'use strict';

var http = require('http');
var fs = require('fs');
var io = require("socket.io");

var Player = function(playerName) {

	this.name = playerName;
	this.x;
	this.y;
	this.z;
	this.id;

};

module.exports = Player;
