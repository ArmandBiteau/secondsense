'use strict';

class Room {

	constructor(id, host, roomName, maxPlayers) {

		this.id = id;

		this.host = host;

		this.name = roomName;

		this.available = true;

		this.maxPlayers = maxPlayers;

		this.players = [];

		this.messages = [];

	}

	addPlayer(socket, player) {

		socket.join(this.name);

	    this.players.push(player);

		console.log(player.name+' a rejoint : '+this.name);

		if (this.players.length === this.maxPlayers) {

			this.lock();

		}

		socket.broadcast.to(this.name).emit('new player', {name: player});

		for (var i = 0; i < this.players.length; i++) {

			socket.emit('new player', {name: this.players[i].name, room: this.name});

		}

	}

	addMessage(player, txt) {

		let message = {
			player: player,
			content: txt
		};

		this.messages.push(message);
	}

	removePlayer(socket, player) {

		socket.leave(this.name);

		let playerToDelete = this.players.indexOf(player);

	    if (playerToDelete !== -1) {

	    	this.players.splice(playerToDelete, 1);

	    }

		if (this.players.length < this.maxPlayers) {

			this.unlock();

		}

	}

	updatePlayerPosition(data) {

	    let player = this.playerById(data.id);
		player.id = data.id;
	    player.x = data.x;
	    player.y = data.y;
	    player.z = data.z;

		return player;

	}

	updatePlayerGems(data) {

	    let player = this.playerById(data.id);
		player.gems++;

		return player;

	}

    playerById(id) {

	    for (let i = 0; i < this.players.length; i++) {

	        if (this.players[i].id === id) {

				return this.players[i];

	        }

	    }

	    return false;

    }

	lock() {

		this.available = false;

	}

	unlock() {

		this.available = true;

	}

}

export default Room;
