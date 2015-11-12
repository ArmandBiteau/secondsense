'use strict';

var THREE = require('three');

module.exports = {

    created: function() {

		// Lights

		this._spotLight = null;

		this._spotLightColor = '#FFFFFF';

        this.__spotLightIntensity = 10;

		this._spotLightPosition = new THREE.Vector3(10, 10, 10);

	},

	methods: {

		lightInitialize: function() {

			this._spotLight = new THREE.SpotLight(this._spotLightColor, this._spotLightIntensity);

			this._spotLight.position.set(this._spotLightPosition.x, this._spotLightPosition.y, this._spotLightPosition.z);

			this._scene.add(this._spotLight);

		},

		lightsUpdate: function() {

		}
	}
};
