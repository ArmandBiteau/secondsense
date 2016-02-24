'use strict';

// import THREE from 'three';

import Opponent from '../models/opponent';

export default {

    created: function() {

		// Opponents

		this.opponents = null;

	},

	methods: {

		opponentsInitialize: function() {

            this.opponents = [];

            var j = 0;

            for (let i = 0; i < this.GameRoom.players.length; i++) {

                if (this.GameRoom.players[i].id !== this.me.id) {

                    this.opponents[j] = new Opponent(this.GameRoom.players[i].id, 0x9966CC, 0, 0.5, 0);

                    this._scene.add(this.opponents[j].mesh);

                    j++;

                }

            }

            var _this = this;

            // SHARE MY POSITION 12fps
            setInterval(() => {

                var position = this._controls.getObject().position;
                var data = {id: this.me.id, x: position.x, y:position.y, z:position.z};

                this.socket.emit('update player position', data);

            }, 80);

            // GET OPPONENTS POSITION
            this.socket.on('update player position', _this.onUpdateOpponentPosition);

		},

		opponentsUpdate: function() {

		},

        onUpdateOpponentPosition: function(opponent) {

            let opp = this.opponentById(opponent.id);

            opp.updateMeshPosition(opponent.x, opponent.y, opponent.z);

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
