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

		this._cubePositionInitial = new THREE.Vector3(0, 0, 0);

	},

	methods: {

		cubeInitialize: function() {

            let geometry = new THREE.OctahedronGeometry();

            let material = new THREE.MeshLambertMaterial({color: 0x00FFFF});

            this._cube = new THREE.Mesh(geometry, material);

            //let dimensions = new THREE.Box3().setFromObject(this._cube);

            this._cube.position.set(1, 0.4, 1);

            this._cube.scale.set(0.2, 0.1, 0.2);

			this._scene.add(this._cube);

            this._collidableMeshList.push(this._cube);

		},

		cubeUpdate: function() {

            this._cube.rotation.y += 0.01;

		}
	}
};
