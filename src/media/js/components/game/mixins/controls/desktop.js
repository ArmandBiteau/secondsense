'use strict';

// import THREE from 'three';

var PointerLockControls = require('../../../../core/pointerLockControls');

// import {
//     PATH_GLSL
// } from '../../../core/config';

import Emitter from '../../../../core/emitter';

export default {

    created: function() {

		// Controls

		this._controls = null;

        this._controlsEnabled = false;

        this.isEnableCollisionDiamond = true;

        this.isEnableCollisionBonus = true;

	},

    ready: function() {

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

		controlsInitialize: function() {

            document.querySelector('canvas').addEventListener('mousedown', () => {

                document.body.requestPointerLock();

            });

            this._controlsTime = Date.now();

            this.controlsRequest();

            this._controls = new PointerLockControls(this._camera);

            this._scene.add(this._controls.getObject());

            this._ray = new THREE.Raycaster();

			this._ray.ray.direction.set(0, -1, 0);

		},

		controlsUpdate: function() {

            this._controls.isOnObject(false);

            var point = new THREE.Vector3(0, 0, -1);
            point.applyMatrix4(this._camera.matrixWorld);

            var point2 = new THREE.Vector3(0, 0, 0);
            point2.copy(this._controls.getObject().position);

            var lookAt = new THREE.Vector3(point.x - point2.x, point.y - point2.y, point.z - point2.z);

            this._ray.ray.origin.copy(this._controls.getObject().position);
            this._ray.ray.direction = lookAt;
            this._ray.ray.direction.normalize();
            this._ray.ray.direction.y = 0.5;

            // Collision mur

            var intersectionWalls = this._ray.intersectObjects(this._collidableMeshList);

            if (intersectionWalls.length > 0) {

                var distance = intersectionWalls[0].distance;

                if (distance > 0 && distance < 0.75) {

                    // console.log('collide wall');

                    this._controls.isOnObject(true);

                }

            }

            // Collision Bonus

            if (this.isEnableCollisionBonus) {

                var intersectionBonus = this._ray.intersectObjects(this._collidableMeshBonus);

                if (intersectionBonus.length > 0) {

                    var distance2 = intersectionBonus[0].distance;

                    if (distance2 > 0 && distance2 < 0.75) {

                        this.isEnableCollisionBonus = false;

                        // console.log('collide bonus');

                        // console.log(intersectionBonus[0].object.name);

                        Emitter.emit('BONUS_PICKED_UP', {id: intersectionBonus[0].object.name});

                        this._controls.isOnObject(true);

                    }

                }

            }

            // Collision diamand

            if (this.isEnableCollisionDiamond) {

                var intersectionDiamond = this._ray.intersectObjects(this._collidableMeshDiamond);

                if (intersectionDiamond.length > 0) {

                    var distance3 = intersectionDiamond[0].distance;

                    if (distance3 > 0 && distance3 < 0.75) {

                        // console.log('collide diamond');

                        this.isEnableCollisionDiamond = false;

                        Emitter.emit('GET_GEM', this.me.id);

                        this._controls.isOnObject(true);

                    }

                }

            }

            this._controls.update(Date.now() - this._controlsTime);

            this._controlsTime = Date.now();

        }
	}
};
