'use strict';

import THREE from 'three';

// import {
//     PATH_GLSL
// } from '../../../core/config';

export default {

    created: function() {

		// Cube

		this._cube = null;

        this._cubeMaterial = null;

	},

	methods: {

		cubeInitialize: function() {

            let geometry = new THREE.BoxGeometry(600, 600, 600);

            this._cubeMaterial = new THREE.MeshPhongMaterial({color: 0x4249d6, shading: THREE.SmoothShading});

            this._cube = new THREE.Mesh(geometry, this._cubeMaterial);

            this._cube.position.set(0, 0, 0);

			this._scene.add(this._cube);

		},

		cubeUpdate: function() {

            this._cube.rotation.x = Math.PI / 4;
            this._cube.rotation.y += 0.005;
            this._cube.rotation.z += 0.005;

		}
	}
};
