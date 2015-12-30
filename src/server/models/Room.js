'use strict';

import Socket from './Socket';

class Room {

	constructor(roomName) {

		this.name = roomName;

		this.maxPlayers = 5;

		this.players = [];

	}

	addPlayer(player) {

		Socket.join(this.name);

	    this.players.push(player);

		console.log(player.name+' a rejoint : '+this.name);

		Socket.broadcast.to(this.name).emit('new player', {name: player});

		for (var i = 0; i < this.players.length; i++) {

			Socket.emit('new player', {name: this.players[i].name});

		}

	}

	removePlayer(player) {

		Socket.leave(this.name);

		let playerToDelete = this.players.indexOf(player);

	    if (playerToDelete !== -1) {

	    	this.players.splice(playerToDelete, 1);

	    }

	}

    playerById() {

    }

}

export default Room;
