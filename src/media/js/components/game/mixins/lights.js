'use strict';

import THREE from 'three';

export default {

    created: function() {

		// Lights

		this._spotLight = null;

		this._spotLightColor = '#FFFFFF';

        this._spotLightIntensity = 1000;

		this._spotLightPosition = new THREE.Vector3(100, 200, 200);

	},

	methods: {

		lightInitialize: function() {

            // this._scene.add(new THREE.AmbientLight(0xf9f9f9));

            this._dirLight = new THREE.DirectionalLight(0xffffff, 1);

			this._dirLight.position.set(100, 200, 200);

            // this._dirLight.castShadow = true;

			this._scene.add(this._dirLight);

		},

		lightsUpdate: function() {

		}
	}
};
