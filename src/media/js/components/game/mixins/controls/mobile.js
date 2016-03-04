'use strict';

import THREE from 'three';

// import {
//     PATH_GLSL
// } from '../../../core/config';

export default {

    created: function() {

		// Controls

		this._controls = null;

	},

    ready: function() {

	},

	methods: {

		controlsInitialize: function() {

            this._controls = new THREE.VRControls(this._camera);

            console.log('Mobile controls initialized.');

		},

		controlsUpdate: function() {

            this._controls.update();

		}
	}
};
