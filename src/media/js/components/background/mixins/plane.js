'use strict';

import THREE from 'three';

// import {
//     PATH_GLSL
// } from '../../../core/config';

export default {

    created: function() {

		// Cube

		this._plane = null;

	},

	methods: {

		planeInitialize: function() {

            let geometry = new THREE.PlaneGeometry(700, 700, 10, 10);

            this._planeMaterial = new THREE.MeshPhongMaterial({
                color: 0x171c20,
                shading: THREE.FlatShading,
                polygonOffset: true,
                polygonOffsetFactor: 1,
                polygonOffsetUnits: 1
            });

            this._plane = new THREE.Mesh(geometry, this._planeMaterial);

            this._plane.position.set(0, 0, -100);

			this._scene.add(this._plane);

            // this._planeHelper = new THREE.EdgesHelper(this._plane, 0xffffff);
            this._planeHelper = new THREE.WireframeHelper(this._plane, 0x292d32);
            this._planeHelper.material.linewidth = 1;
            this._scene.add(this._planeHelper);

		},

		planeUpdate: function() {

            // this._cube.rotation.y += 0.005;
            // this._cube.rotation.z += 0.005;

		}
	}
};
