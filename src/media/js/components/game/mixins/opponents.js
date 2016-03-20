'use strict';

// import THREE from 'three';

import Opponent from '../models/opponent';

export default {

    created: function() {

		// Opponents

	},

	methods: {

		opponentsInitialize: function() {

            this.opponents = [];

            for (let i = 0; i < this.GameRoom.players.length; i++) {

                this.opponents[i] = new Opponent(this.GameRoom.players[i].id, this.GameRoom.players[i].name, this.GameRoom.players[i].color, 0, 0.5, 0);

                if (this.GameRoom.players[i].id !== this.me.id) {

                    this._scene.add(this.opponents[i].mesh);

                }

            }

            var _this = this;

            // GET OPPONENTS POSITION
            this.socket.on('update player position', _this.onUpdateOpponentPosition);
            this.socket.on('add player gem', _this.onAddOpponentGem);

		},

		opponentsUpdate: function() {

            var position;
            var data;

            if (this.device === 'desktop') {

                // SHARE MY POSITION each frame
                position = this._controls.getObject().position;
                data = {id: this.me.id, x: position.x, y:position.y, z:position.z};
                this.socket.emit('update player position', data);

            } else {

                position = this._camera.position;
                data = {id: this.me.id, x: position.x, y:position.y, z:position.z};
                this.socket.emit('update player position', data);

            }

		},

        onUpdateOpponentPosition: function(opponent) {

            if (this.opponents) {

                let opp = this.opponentById(opponent.id);

                opp.updateMeshPosition(opponent.x, opponent.y, opponent.z);

            }

        },

        onAddOpponentGem: function(opponent) {

            this.opponentById(opponent.id).addGem();

            let player = this.playerById(opponent.id);
			player.gems++;

        },

        opponentById: function(id) {

            for (let i = 0; i < this.opponents.length; i++) {

                if (this.opponents[i].id === id) {

                    return this.opponents[i];

                }

            }

            return false;

        }

	}

};
