'use strict';

import THREE from 'three';

// import {
//     PATH_GLSL
// } from '../../../core/config';

export default {

    created: function() {

		// Cube

		this._cube = null;

		this._cubeColor = '#FFFFFF';

	},

	methods: {

		cubeInitialize: function() {

            let geometry = new THREE.BoxGeometry(1, 1, 1);

            let material = new THREE.MeshLambertMaterial({color: 0x4249d6});

            this._cube = new THREE.Mesh(geometry, material);

            this._cube.position.set(0, 0, -3);

			this._scene.add(this._cube);

		},

		cubeUpdate: function() {

            this._cube.rotation.y += 0.01;
            this._cube.rotation.z += 0.01;

		}
	}
};
