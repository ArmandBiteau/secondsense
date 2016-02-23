'use strict';

import THREE from 'three';

import Opponent from '../models/opponent';

export default {

    created: function() {

		// Opponents

        this._opponentsLength = 0;

		this._opponents = null;

		this._opponentsColor = {color: 0x9966CC};

		this._opponentsPositionInitial = new THREE.Vector3(0.0, 0.25, 0.0);

	},

	methods: {

		opponentsInitialize: function() {

            this._opponents = [];

            for (let i = 0; i < this.GameRoom.players.length; i++) {

                if (this.GameRoom.players[i].id !== this.me.id) {

                    this._opponents[i] = new Opponent(this.GameRoom.players[i].id, 0x9966CC, 0, 0.25, 0);

                    this._scene.add(this._opponents[i].mesh);

                }

            }

            var _this = this;

            // SHARE MY POSITION ~1s
            setInterval(() => {

                var position = this._controls.getObject().position;
                var data = {id: _this.me.id, x: position.x, y:position.y, z:position.z};

                this.socket.emit('update player position', data);

            }, 40);

            // GET OPPONENTS POSITION
            this.socket.on('update player position', _this.onUpdateOpponentPosition);

		},

		opponentsUpdate: function() {

            //for (let i = 0; i < this._opponents.length; i++) {

            //    this._opponents[i].position.set(0, 0.5, 0);

            //}

		},

        onUpdateOpponentPosition: function(opponent) {

            this.updateOpponentPosition(opponent.id, opponent.x, opponent.y, opponent.z);

        },

        updateOpponentPosition: function(id, x, y, z) {

            let opp = this.opponentById(id);

            opp.updateMeshPosition(x, y, z);

        },

        opponentById: function(id) {

            for (let i = 0; i < this._opponents.length; i++) {

                if (this._opponents[i].id === id) {

                    return this._opponents[i];

                }

            }

            return false;

        }

	}

};
