'use strict';

import THREE from 'three';

export default {

    created: function() {

		// Sound Emitter

		this._soundEmitter = null;

        this._sound = null;

		this._soundEmitterColor = '#FFFFFF';

		this._soundEmitterPositionInitial = new THREE.Vector3(0.75, 0, -1);

	},

	methods: {

		soundEmitterInitialize: function() {

            let geometry = new THREE.OctahedronGeometry(0.2, 0);

            let material = new THREE.MeshPhongMaterial({ color: 0xFF0000, shininess: 30, shading: THREE.FlatShading });

            this._soundEmitter = new THREE.Mesh(geometry, material);

            let dimensions = new THREE.Box3().setFromObject(this._soundEmitter);

            this._soundEmitter.position.set(this._soundEmitterPositionInitial.x, this._soundEmitterPositionInitial.y + dimensions.max.y + 0.25, this._soundEmitterPositionInitial.z);

			this._scene.add(this._soundEmitter);

            this._sound = new THREE.Audio(this._listener);

            let randomSound = Math.floor(Math.random() * 3) + 1;

			this._sound.load('/media/sounds/'+randomSound+'.ogg');

            this._sound.setRefDistance(10);

            this._sound.autoplay = true;

            this._sound.loop = true;

			this._soundEmitter.add(this._sound);

		},

		soundEmitterUpdate: function() {

            this._soundEmitter.rotation.y -= 0.02;

		}
	}
};
