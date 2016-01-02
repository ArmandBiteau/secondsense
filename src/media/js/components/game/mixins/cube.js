'use strict';

import THREE from 'three';

// import {
//     PATH_GLSL
// } from '../../../core/config';

var fragment = require('../../../../glsl/test-fs.glsl');

console.log(fragment());

export default {

    created: function() {

		// Cube

		this._cube = null;

		this._cubePositionInitial = new THREE.Vector3(0, 0, -1);

	},

	methods: {

		cubeInitialize: function() {

            let geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

            let material = new THREE.MeshLambertMaterial({color: 0x00FFFF});

            this._cube = new THREE.Mesh(geometry, material);

            let dimensions = new THREE.Box3().setFromObject(this._cube);

            this._cube.position.set(this._cubePositionInitial.x, this._cubePositionInitial.y + dimensions.max.y, this._cubePositionInitial.z);

			this._scene.add(this._cube);

            this._collidableMeshList.push(this._cube);

		},

		cubeUpdate: function() {

            // this._cube.rotation.y += 0.01;

		}
	}
};
