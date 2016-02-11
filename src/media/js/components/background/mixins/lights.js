'use strict';

import THREE from 'three';

export default {

    created: function() {

		// Lights

		this._spotLight = null;

		this._spotLightColor = '#FFFFFF';

        this._spotLightIntensity = 1000;

		this._spotLightPosition = new THREE.Vector3(1, 2, 2);

	},

	methods: {

		lightsInitialize: function() {

            this._dirLight = new THREE.DirectionalLight(0xffffff, 0.9);

			this._dirLight.position.set(500, 1000, 1000);

            this._dirLight.castShadow = true;

			this._scene.add(this._dirLight);

		},

		lightsUpdate: function() {

		}
	}
};
