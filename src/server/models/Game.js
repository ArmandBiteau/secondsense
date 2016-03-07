'use strict';

import Room from './Room';

class Game {

	constructor() {

		this.rooms = [];

	}

    addRoom(id, host, roomName, maxPlayers) {

        this.rooms.push(new Room(id, host, roomName, maxPlayers));

    }

    removeRoom(room) {

		console.log('Delete '+room.name);

        let roomToDelete = this.rooms.indexOf(room);

        if (roomToDelete !== -1) {

        	this.rooms.splice(roomToDelete, 1);

        }

    }

    updateRooms(socket) {

		for (var i = 0; i < this.rooms.length; i++) {

			if (this.rooms[i].players.length < this.rooms[i].maxPlayers && this.rooms[i].players.length !== 0) {

				this.rooms[i].unlock();

			}

			if (this.rooms[i].players.length === this.rooms[i].maxPlayers) {

				this.rooms[i].lock();

			}

			if (this.rooms[i].players.length === 0) {

				this.removeRoom(this.rooms[i]);

			}

    	}

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
