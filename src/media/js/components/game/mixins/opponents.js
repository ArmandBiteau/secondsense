'use strict';

import THREE from 'three';

export default {

    created: function() {

		// Opponents

        this._opponentsLength = 0;

		this._opponents = null;

		this._opponentsColor = {color: 0x9966CC};

		this._opponentsPositionInitial = new THREE.Vector3(0.0, 0.5, 0.0);

	},

	methods: {

		opponentsInitialize: function() {

            this._opponents = [];

            for (let i = 0; i < this._opponents.length; i++) {

                  let geometry = new THREE.SphereGeometry(0.1, 16, 16);

                  let material = new THREE.MeshLambertMaterial(this._opponentsColor);

                  this._opponents[i] = new THREE.Mesh(geometry, material);

                  this._opponents[i].position.set(0.0, 0.5, 0.0);

                  this._scene.add(this._opponents[i]);

            }

		},

		opponentsUpdate: function() {

            for (let i = 0; i < this._opponents.length; i++) {

                this._opponents[i].position.set(0, 0.5, 0);

            }

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
