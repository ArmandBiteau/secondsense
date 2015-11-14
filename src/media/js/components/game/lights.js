'use strict';

var THREE = require('three');

module.exports = {

    created: function() {

		// Lights

		this._spotLight = null;

		this._spotLightColor = '#FFFFFF';

        this.__spotLightIntensity = 1000;

		this._spotLightPosition = new THREE.Vector3(1, 2, 2);

	},

	methods: {

		lightInitialize: function() {

			// this._spotLight = new THREE.SpotLight(this._spotLightColor, this._spotLightIntensity);
            //
			// this._spotLight.position.set(this._spotLightPosition.x, this._spotLightPosition.y, this._spotLightPosition.z);
            //
			// this._scene.add(this._spotLight);

            // this._scene.add(THREE.AmbientLight(0x212223));

            this._dirLight = new THREE.DirectionalLight(0xffffff, 1);

			this._dirLight.position.set(10, 20, 20);

            this._dirLight.castShadow = true;

			this._scene.add(this._dirLight);

		},

		lightsUpdate: function() {

		}
	}
};
