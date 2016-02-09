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

        Secondsense.addRoom('First room', 3);

    }

    setEventHandlers() {

		let _this = this;

    	Socket.sockets.on('connection', (client) => {

	        console.log('Quelqu\'un de nouveau dans le game !');

	    	client.on('disconnect', _this.onClientDisconnect);

	    	client.on('new player', _this.onNewPlayer);

	    	client.on('switch room', _this.onSwitchRoom);

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

        } else {

            console.log('Unknown player has disconnected !');

        }

    }

    onNewPlayer(data) {

        this.player = new Player(data.name);

        this.room = null;

        Secondsense.updateRooms(this);

    }

    onSwitchRoom(newroom) {

		if (this.room) {

			this.room.removePlayer(this, this.player);

		}

        this.room = Secondsense.roomByName(newroom);

        this.room.addPlayer(this, this.player);

        Secondsense.updateRooms(this);

    }

	onNewRoom(newroom) {

		Secondsense.addRoom(newroom.name, newroom.maxPlayers);

        this.room = Secondsense.roomByName(newroom.name);

        this.room.addPlayer(this, this.player);

        Secondsense.updateRooms(this);

    }

}

export default Manager;
