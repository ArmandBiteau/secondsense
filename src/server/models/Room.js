'use strict';

class Room {

	constructor(roomName) {

		this.name = roomName;

		this.maxPlayers = 5;

		this.players = [];

	}

	addPlayer(socket, player) {

		socket.join(this.name);

	    this.players.push(player);

		console.log(player.name+' a rejoint : '+this.name);

		socket.broadcast.to(this.name).emit('new player', {name: player});

		for (var i = 0; i < this.players.length; i++) {

			socket.emit('new player', {name: this.players[i].name});

		}

	}

	removePlayer(socket, player) {

		socket.leave(this.name);

		let playerToDelete = this.players.indexOf(player);

	    if (playerToDelete !== -1) {

	    	this.players.splice(playerToDelete, 1);

	    }

	}

    playerById() {

    }

}

export default Room;
