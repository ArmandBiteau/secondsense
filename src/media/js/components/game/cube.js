'use strict';

var THREE = require('three');

module.exports = {

    created: function() {

		// Cube

		this._cube = null;

		this._cubeColor = '#FFFFFF';

		this._cubePositionInitial = new THREE.Vector3(0, 0, -1);

	},

	methods: {

		cubeInitialize: function() {

            var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

            var material = new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading });

            this._cube = new THREE.Mesh(geometry, material);

            this._cube.position.set(this._cubePositionInitial.x, this._cubePositionInitial.y, this._cubePositionInitial.z);

			this._scene.add(this._cube);

		},

		cubeUpdate: function() {

            this._cube.rotation.y += 0.01;

            // this._cube.rotation.z += 0.01;

		}
	}
};
