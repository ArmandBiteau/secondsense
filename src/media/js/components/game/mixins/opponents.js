'use strict';

import THREE from 'three';

export default {

    created: function() {

		// Opponents

    this._opponentsNumber = null;

		this._opponents = [];

		this._opponentsColor = {color: 0x9966CC};

		this._opponentsPositionInitial = new THREE.Vector3(0, 0.4, 0);

	},

	methods: {

		opponentsInitialize: function(opponentsNumber) {

            this._opponentsNumber = opponentsNumber;

            let i;

            for (i = 0; i < opponentsNumber; i++) {

                  let geometry = new THREE.SphereGeometry(0.1, 16, 16);

                  let material = new THREE.MeshPhongMaterial(this._opponentsColor);

                  this._opponents[i] = new THREE.Mesh(geometry, material);

                  this._opponents[i].position.set(0, 0.4, 0);

                  this._scene.add(this._opponents[i]);

            }

		},

		opponentsUpdate: function(posArray) {

      let i;

      for (i = 0; i < posArray.length; i++) {

            this._opponents[i].position.set(posArray[i].x, posArray[i].y, posArray[i].z);

      }

		}
	}
};
