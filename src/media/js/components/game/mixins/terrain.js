'use strict';

import THREE from 'three';

export default {

    created: function() {

		// Terrain

		this._terrain = null;

		this._terrainColor = '#FFFFFF';

		this._terrainPositionInitial = new THREE.Vector3(0, 0, 0);

	},

	methods: {

		terrainInitialize: function() {

            var geometry = new THREE.PlaneGeometry(40, 40);

            var material = new THREE.MeshBasicMaterial({color: 0x2c2c2c});

            this._terrain = new THREE.Mesh(geometry, material);

            this._terrain.position.set(this._terrainPositionInitial.x, this._terrainPositionInitial.y, this._terrainPositionInitial.z);

            this._terrain.rotation.x = -Math.PI / 2;

			this._scene.add(this._terrain);

            var helper = new THREE.GridHelper(40, 0.25);

			helper.color1.setHex(0x6a6a6a);

			helper.color2.setHex(0x6a6a6a);

			helper.position.y = 0;

			this._scene.add(helper);

		},

		terrainUpdate: function() {

		}
	}
};
