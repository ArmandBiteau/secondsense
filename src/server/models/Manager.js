'use strict';

import Server from './Server';

import Socket from './Socket';

import Game from './Game';

import Player from './Player';

class Manager {

	constructor() {

        this.game = new Game();

        this.start();

        this.setEventHandlers();

	}

    start() {

        Server.listen(3000);

        console.log('Server running at http://192.168.33.10:3000/');

        this.game.addRoom('Temporary room');
        this.game.addRoom('Another room');

    }

    setEventHandlers() {

    	Socket.sockets.on('connection', this.onSocketConnection.bind(this));

    }

    onSocketConnection(client) {

    	// console.log("New player has connected: "+client.id);
        console.log('Quelqu\'un de nouveau dans le game !');

        // Listen for client disconnected
    	client.on('disconnect', this.onClientDisconnect.bind(this));

        // Listen for new player message
    	client.on('new player', this.onNewPlayer.bind(this));

        // Listen for player room
    	client.on('switch room', this.onSwitchRoom.bind(this));

    }

    onClientDisconnect() {

        if (this.player) {

            console.log('Player has disconnected: '+this.player.name);

            var playerToDelete = this.room.players.indexOf(this.player);

            if (playerToDelete !== -1) {

            	this.room.players.splice(playerToDelete, 1);

            }

        	Socket.broadcast.emit('remove player', {name: this.player.name});

        } else {

            console.log('Unknown player has disconnected !');

        }

    }

    onNewPlayer(data) {

        this.player = new Player(data.name);

        this.room = this.game.roomByName('Temporary room');

        this.room.addPlayer(this.player);

        this.game.updateRooms();

    }

    onSwitchRoom(newroom) {

        this.room.removePlayer(this.player);

        this.room = this.game.roomByName(newroom);

        this.room.addPlayer(this.player);

        this.game.updateRooms();

    }

}

export default Manager;
