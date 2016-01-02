'use strict';

import Room from './Room';

class Game {

	constructor() {

		this.rooms = [];

	}

    addRoom(roomName) {

        this.rooms.push(new Room(roomName));

    }

    removeRoom(room) {

        let roomToDelete = this.rooms.indexOf(room);

        if (roomToDelete !== -1) {

        	this.rooms.splice(roomToDelete, 1);

        }

    }

    updateRooms(socket) {

		socket.broadcast.emit('update rooms', this.rooms);

		socket.emit('update rooms', this.rooms);

    }

    roomByName(roomName) {

        for (var i = 0; i < this.rooms.length; i++) {

    		if (this.rooms[i].name === roomName)

    			return this.rooms[i];

    	}

    	return false;

    }

}

export default Game;
