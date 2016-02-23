'use strict';

// import THREE from 'three';

var PointerLockControls = require('../../../core/pointerLockControls');

// import {
//     PATH_GLSL
// } from '../../../core/config';

export default {

    created: function() {

		// Controls

		this._controls = null;

        this._controlsEnabled = false;

        // var moveForward = false;
        // var moveBackward = false;
        // var moveLeft = false;
        // var moveRight = false;
        // var canJump = false;
        // var prevTime = performance.now();
        // var velocity = new THREE.Vector3();

	},

	methods: {

        controlsRequest: function() {

            var _this = this;

            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
			if (havePointerLock) {

                var element = document.body;
				var pointerlockchange = function() {

					if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
						this._controlsEnabled = true;
						_this._controls.enabled = true;
					} else {
						_this._controls.enabled = false;
					}

				};

				// Hook pointer lock state change events
				document.addEventListener('pointerlockchange', pointerlockchange, false);
				document.addEventListener('mozpointerlockchange', pointerlockchange, false);
				document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

				// Ask the browser to lock the pointer
				element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

                if (/Firefox/i.test(navigator.userAgent)) {

					var fullscreenchange = function() {

						if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
							document.removeEventListener('fullscreenchange', fullscreenchange);
							document.removeEventListener('mozfullscreenchange', fullscreenchange);
							element.requestPointerLock();
						}

					};

					document.addEventListener('fullscreenchange', fullscreenchange, false);
					document.addEventListener('mozfullscreenchange', fullscreenchange, false);
					element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
					element.requestFullscreen();

				} else {
					element.requestPointerLock();
				}

			}

        },

        addEventListener: function() {

        },

		controlsInitialize: function() {

            this._controlsTime = Date.now();

            this.controlsRequest();

            this._controls = new PointerLockControls(this._camera);

            this._scene.add(this._controls.getObject());

            this._ray = new THREE.Raycaster();

			this._ray.ray.direction.set(0, -1, 0);

		},

		controlsUpdate: function() {

            this._controls.isOnObject(false);

			this._ray.ray.origin.copy(this._controls.getObject().position);
			this._ray.ray.origin.y -= 1;

			var intersections = this._ray.intersectObjects(this._collidableMeshList);

			if (intersections.length > 0) {

				var distance = intersections[0].distance;

				if (distance > 0 && distance < 1) {

                    console.log('collide');

					this._controls.isOnObject(true);

				}

			}

			this._controls.update(Date.now() - this._controlsTime);

			this._controlsTime = Date.now();

		}
	}
};
