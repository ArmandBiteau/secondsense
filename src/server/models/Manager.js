'use strict';

import Server from './Server';

import Socket from './Socket';

import Game from './Game';

import Player from './Player';

// DROP THE GAME
var Secondsense;

class Manager {

	constructor() {

        Secondsense = new Game();

        this.start();

        this.setEventHandlers();

	}

    start() {

        Server.listen(3000);

        console.log('Server running at http://192.168.33.10:3000/');

        Secondsense.addRoom('FristRoomidtest', 'First room', 3);

    }

    setEventHandlers() {

		let _this = this;

    	Socket.sockets.on('connection', (client) => {

	        console.log('Quelqu\'un de nouveau dans le game !');

	    	client.on('disconnect', _this.onClientDisconnect);

	    	client.on('new player', _this.onNewPlayer);

	    	client.on('switch room', _this.onSwitchRoom);

			client.on('exit room', _this.onExitRoom);

			client.on('new room', _this.onNewRoom);

		});

    }

    onClientDisconnect() {

        if (this.player) {

            console.log(this.player.name+' has disconnected !');

			if (this.room) {

				let playerToDelete = this.room.players.indexOf(this.player);

	            if (playerToDelete !== -1) {

	            	this.room.players.splice(playerToDelete, 1);

	            }

			}

        	this.broadcast.emit('remove player', {name: this.player.name});

			Secondsense.updateRooms(this);

        } else {

            console.log('Unknown player has disconnected !');

        }

    }

    onNewPlayer(data) {

        this.player = new Player(data.name);

        this.room = null;

        Secondsense.updateRooms(this);

    }

    onSwitchRoom(id) {

		if (this.room) {

			this.room.removePlayer(this, this.player);

		}

        this.room = Secondsense.roomById(id);

        this.room.addPlayer(this, this.player);

        Secondsense.updateRooms(this);

    }

	onExitRoom() {

		if (this.room) {

			this.room.removePlayer(this, this.player);

		}

		Secondsense.updateRooms(this);

		this.emit('exit room');

    }

	onNewRoom(newroom) {

		Secondsense.addRoom(newroom.id, newroom.name, newroom.maxPlayers);

		if (this.room) {

			this.room.removePlayer(this, this.player);

		}

        this.room = Secondsense.roomById(newroom.id);

        this.room.addPlayer(this, this.player);

        Secondsense.updateRooms(this);

    }

}

export default Manager;
