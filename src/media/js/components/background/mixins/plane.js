'use strict';

import THREE from 'three';

var glslify = require('glslify');

// import {
//     PATH_GLSL
// } from '../../../core/config';

export default {

    created: function() {

		// Cube

		this._plane = null;

        this._frame = 0;

	},

	methods: {

		planeInitialize: function() {

            let geometry = new THREE.PlaneGeometry(18000, 6000, 45, 15);

            // this._planeMaterial = new THREE.MeshLambertMaterial({
            //     wireframe: true,
            //     polygonOffset: true,
            //     polygonOffsetFactor: 1,
            //     polygonOffsetUnits: 1
            // });

            this._planeMaterial = new THREE.RawShaderMaterial({
                uniforms: {
                    time: {
                        type: 'f',
                        value: 0.0
                    },
                    speed: {
                        type: 'f',
                        value: 1.0
                    },
                    resolution: {
                        type: 'f',
                        value: 1.0
                    },
                    color: {
                        type: 'c',
                        value: new THREE.Color(0xffffff)
                    },
                    ghostify: {
                        type: 'f',
                        value: 5.0
                    },
                    brightness: {
                        type: 'f',
                        value: 0.2
                    }
                },
                vertexShader: glslify('./../../../../glsl/background/plane-vs.glsl'),
                fragmentShader: glslify('./../../../../glsl/background/plane-fs.glsl'),
                side: THREE.DoubleSide,
                transparent: false,
                fog: true,
                wireframe: true,
                wireframeLinewidth: 1.5
            });

            this._plane = new THREE.Mesh(geometry, this._planeMaterial);

            this._plane.position.set(0, 2000, -3000);

			this._scene.add(this._plane);

            // // this._planeHelper = new THREE.EdgesHelper(this._plane, 0xffffff);
            // this._planeHelper = new THREE.WireframeHelper(this._plane, 0x292d32);
            // this._planeHelper.material.linewidth = 1;
            // this._scene.add(this._planeHelper);

		},

		planeUpdate: function() {

            this._plane.material.uniforms.time.value = this._frame/100;

            this._frame++;

            // this._cube.rotation.y += 0.005;
            // this._cube.rotation.z += 0.005;

		}
	}
};
