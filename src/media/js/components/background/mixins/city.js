'use strict';

var glslify = require('glslify');

import THREE from 'three';

// import {
//     PATH_GLSL
// } from '../../../core/config';

export default {

    created: function() {

		// City

		this._city = null;

        this.cityGeometry = null;

        this._cityMaterial = null;

        this._cubeInstances = 36*12;

        this._cubeMaxHeight = 10;

	},

	methods: {

		cityInitialize: function() {

            this._cityGeometry = new THREE.InstancedBufferGeometry();

            // per mesh data
            var vertices = new THREE.BufferAttribute(new Float32Array([
                // Front
                -1,  1,  1,
                 1,  1,  1,
                -1, -1,  1,
                 1, -1,  1,
                // Back
                 1,  1, -1,
                -1,  1, -1,
                 1, -1, -1,
                -1, -1, -1,
                // Left
                -1,  1, -1,
                -1,  1,  1,
                -1, -1, -1,
                -1, -1,  1,
                // Right
                 1,  1,  1,
                 1,  1, -1,
                 1, -1,  1,
                 1, -1, -1,
                // Top
                -1,  1,  1,
                 1,  1,  1,
                -1,  1, -1,
                 1,  1, -1,
                // Bottom
                 1, -1,  1,
                -1, -1,  1,
                 1, -1, -1,
                -1, -1, -1
            ]), 3);

            this._cityGeometry.addAttribute('position', vertices);

            var uvs = new THREE.BufferAttribute(new Float32Array([
                //x    y    z
                // Front
                0, 0,
                1, 0,
                0, 1,
                1, 1,
                // Back
                1, 0,
                0, 0,
                1, 1,
                0, 1,
                // Left
                1, 1,
                1, 0,
                0, 1,
                0, 0,
                // Right
                1, 0,
                1, 1,
                0, 0,
                0, 1,
                // Top
                0, 0,
                1, 0,
                0, 1,
                1, 1,
                // Bottom
                1, 0,
                0, 0,
                1, 1,
                0, 1
            ]), 2);

            this._cityGeometry.addAttribute('uv', uvs);

            var indices = new Uint16Array([
                0, 1, 2,
                2, 1, 3,
                4, 5, 6,
                6, 5, 7,
                8, 9, 10,
                10, 9, 11,
                12, 13, 14,
                14, 13, 15,
                16, 17, 18,
                18, 17, 19,
                20, 21, 22,
                22, 21, 23
            ]);

            this._cityGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

            this._cubeOffsets = new THREE.InstancedBufferAttribute(new Float32Array(this._cubeInstances * 3), 3, 1);
            this._cubeTransforms = new THREE.InstancedBufferAttribute(new Float32Array(this._cubeInstances * 3), 3, 1);
            this._cubeInstanceIDs = new THREE.InstancedBufferAttribute(new Float32Array(this._cubeInstances), 1, 1);

            for (var i = 0, ul = this._cubeOffsets.count; i < ul; i++) {

                var x = -36 + (i % 36) * 2;
                var y = -16 + Math.floor(i / 36) * 2;
                var z = 0;

                this._cubeOffsets.setXYZ(i, x, y, z);
                this._cubeTransforms.setXYZ(i, 1, 1, this._cubeMaxHeight);
                this._cubeInstanceIDs.setX(i, i);
            }

            this._cityGeometry.addAttribute('offset', this._cubeOffsets); // per mesh translation
            this._cityGeometry.addAttribute('transform', this._cubeTransforms); // per mesh transformation
            this._cityGeometry.addAttribute('instanceID', this._cubeInstanceIDs); // per mesh instance

            this._cityMaterial = new THREE.RawShaderMaterial({
                uniforms: {
                    time: {type: 'f', value: 0}
                },
                vertexShader: glslify('./../../../../glsl/background/city-vs.glsl'),
                fragmentShader: glslify('./../../../../glsl/background/city-fs.glsl'),
                side: THREE.DoubleSide,
                transparent: false,
                fog: true
            });

            this._city = new THREE.Mesh(this._cityGeometry, this._cityMaterial);

            let scaleAmount = 300;

			this._city.scale.set(scaleAmount, scaleAmount, scaleAmount);

            this._city.rotateX(-Math.PI/2);

            this._city.position.setX(0); // CENTER SCREEN
            this._city.position.setY(-700);
            this._city.position.setZ(-3700);

			this._scene.add(this._city);

		},

		cityUpdate: function() {

            for (var i = 0, ul = this._cubeOffsets.count; i < ul; i++) {

                var displacement = (Math.sin(this._clockElapsedTime + i/125) + 0.5) * this._cubeMaxHeight;
                this._cubeTransforms.setXYZ(i, 1, 1, displacement);

            }

            this._city.material.uniforms.time.value = this._clockElapsedTime * 0.5;

            this._cubeTransforms.needsUpdate = true;
            this._cubeOffsets.needsUpdate = true;

		}
	}
};
