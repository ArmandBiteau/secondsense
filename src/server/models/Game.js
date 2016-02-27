'use strict';

import Room from './Room';

class Game {

	constructor() {

		this.rooms = [];

	}

    addRoom(id, roomName, maxPlayers) {

        this.rooms.push(new Room(id, roomName, maxPlayers));

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

    roomById(id) {

        for (var i = 0; i < this.rooms.length; i++) {

    		if (this.rooms[i].id === id)

    			return this.rooms[i];

    	}

    	return false;

    }

}

export default Game;
