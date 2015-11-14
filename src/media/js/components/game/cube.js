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

            var material = new THREE.MeshLambertMaterial({color: 0xF6F6F6});

            this._cube = new THREE.Mesh(geometry, material);

            var dimensions = new THREE.Box3().setFromObject(this._cube);

            this._cube.position.set(this._cubePositionInitial.x, this._cubePositionInitial.y + dimensions.max.y, this._cubePositionInitial.z);

			this._scene.add(this._cube);

            this._collidableMeshList.push(this._cube);

		},

		cubeUpdate: function() {

            // this._cube.rotation.y += 0.01;

		}
	}
};
