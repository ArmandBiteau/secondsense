'use strict';

var THREE = require('three');

module.exports = {

    created: function() {

		// Terrain

		this._terrain = null;

		this._terrainColor = '#FFFFFF';

		this._terrainPositionInitial = new THREE.Vector3(0, 0, 0);

	},

	methods: {

		terrainInitialize: function() {

            var geometry = new THREE.PlaneGeometry(40, 40);

            var material = new THREE.MeshBasicMaterial({color: 0x4a4a4a});

            this._terrain = new THREE.Mesh(geometry, material);

            this._terrain.position.set(this._terrainPositionInitial.x, this._terrainPositionInitial.y, this._terrainPositionInitial.z);

            this._terrain.rotation.x = -Math.PI / 2;

			this._scene.add(this._terrain);

		},

		terrainUpdate: function() {

		}
	}
};
