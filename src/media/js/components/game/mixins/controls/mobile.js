'use strict';

// import THREE from 'three';

var VRControls = require('../../../../core/vrControls');

// import {
//     PATH_GLSL
// } from '../../../core/config';

import Emitter from '../../../../core/emitter';

export default {

    created: function() {

        // Controls

		this._controls = null;

        this._controlsEnabled = true;

        this.isEnableCollisionDiamond = true;

        this.isEnableCollisionBonus = true;

	},

    ready: function() {

	},

	methods: {

		controlsInitialize: function() {

            // var axisHelper = new THREE.AxisHelper(5);
            // this._scene.add(axisHelper);

            this._camera.position.set(0, 0.5, 0);

            this._controlsTime = Date.now();

            this._controls = new VRControls(this._camera);

            this._scene.add(this._controls.getObject());

            this._ray = new THREE.Raycaster();

			this._ray.ray.direction.set(0, -1, 0);

            console.log('Mobile controls initialized.');

		},

		controlsUpdate: function() {

            this._controls.isOnObject(false);

            var point = new THREE.Vector3(0, 0, -1);
            point.applyMatrix4(this._camera.matrixWorld);

            var point2 = new THREE.Vector3(0, 0, 0);
            point2.copy(this._camera.position);

            var lookAt = new THREE.Vector3(point.x - point2.x, point.y - point2.y, point.z - point2.z);

            this._ray.ray.origin.copy(this._camera.position);
            this._ray.ray.direction = lookAt;
            this._ray.ray.direction.normalize();
            this._ray.ray.direction.y = 0.5;

            // Collision mur

            var intersectionWalls = this._ray.intersectObjects(this._collidableMeshList);

            if (intersectionWalls.length > 0) {

                var distance = intersectionWalls[0].distance;

                if (distance > 0 && distance < 1) {

                    // console.log('collide wall');

                    this._controls.isOnObject(true);

                }

            }

            // Collision Bonus

            if (this.isEnableCollisionBonus) {

                var intersectionBonus = this._ray.intersectObjects(this._collidableMeshBonus);

                if (intersectionBonus.length > 0) {

                    var distance2 = intersectionBonus[0].distance;

                    if (distance2 > 0 && distance2 < 1) {

                        this.isEnableCollisionBonus = false;

                        // console.log('collide bonus');

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

                    if (distance3 > 0 && distance3 < 1) {

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
