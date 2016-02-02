'use strict';

import THREE from 'three';

// import {
//     PATH_GLSL
// } from '../../../core/config';

export default {

    created: function() {

		// Cube

		this._cube = null;

	},

	methods: {

		cubeInitialize: function() {

            let geometry = new THREE.SphereGeometry(0.5, 3, 2);

            let material = new THREE.MeshPhongMaterial({ color: 0x4249d6, shininess: 30, shading: THREE.FlatShading });

            this._cube = new THREE.Mesh(geometry, material);

            this._cube.position.set(0, 0, -1);

			this._scene.add(this._cube);

		},

		cubeUpdate: function() {

            this._cube.rotation.y += 0.01;
            this._cube.rotation.z += 0.01;

		}
	}
};
