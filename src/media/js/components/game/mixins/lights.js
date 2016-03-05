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

            // var ambient = new THREE.AmbientLight(0x444444);
            // this._scene.add(ambient);

			// this._spotLight = new THREE.SpotLight(this._spotLightColor, this._spotLightIntensity);
            //
			// this._spotLight.position.set(this._spotLightPosition.x, this._spotLightPosition.y, this._spotLightPosition.z);
            // this._spotLight.target.position.set(0, 0, 0);
            // this._spotLight.castShadow = true;
        	// this._spotLight.shadow.camera.near = 1200;
        	// this._spotLight.shadow.camera.far = 2500;
        	// this._spotLight.shadow.camera.fov = 90;
        	// this._spotLight.shadow.bias = 0.0001;
        	// this._spotLight.shadow.darkness = 0.5;
            //
            // this._scene.add(this._spotLight);

            this._scene.add(new THREE.AmbientLight(0xf9f9f9));

            this._dirLight = new THREE.DirectionalLight(0xffffff, 1);

			this._dirLight.position.set(100, 200, 200);

            this._dirLight.castShadow = true;

			this._scene.add(this._dirLight);

		},

		lightsUpdate: function() {

		}
	}
};
