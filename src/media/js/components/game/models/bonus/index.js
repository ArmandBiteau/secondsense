'use strict';

import THREE from 'three';

var glslify = require('glslify');

class Bonus {

	constructor(id, type, action, x, y, z) {

		this.id = id;

		this.type = type;

		this.action = action;

		this.x = x;

		this.y = y;

		this.z = z;

		this.color = null;

		this.time = 0;

        this.createGeometry();

        this.createMaterial();

        this.createMesh();

        this.updateMeshPosition(x, y, z);

	}

    createGeometry() {

        this.geometry = new THREE.IcosahedronGeometry(0.08);

    }

    createMaterial() {

		if (this.type === 'me') {

			this.color = new THREE.Color(0x1abc9c);

		} else {

			this.color = new THREE.Color(0xe74c3c);

		}

        //this.material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});

		this.material = new THREE.RawShaderMaterial({
			uniforms: {
				time: {
					type: 'f',
					value: 0.0
				},
				color: {
					type: 'c',
					value: new THREE.Color(0xf3f3f3)
				},
				speed: {
					type: 'f',
					value: 4.0
				},
				resolution: {
					type: 'f',
					value: 1.0
				},
				ghostify: {
					type: 'f',
					value: 3.0
				},
				brightness: {
					type: 'f',
					value: 0.3
				}
			},
			vertexShader: glslify('./../../../../../glsl/bonus/bonus-vs.glsl'),
			fragmentShader: glslify('./../../../../../glsl/bonus/bonus-fs.glsl'),
			side: THREE.DoubleSide,
			fog: true,
			wireframe: true,
			wireframeLinewidth: 1
		});

    }

    createMesh() {

        this.mesh = new THREE.Mesh(this.geometry, this.material);

		this.mesh.scale.set(0.001, 0.001, 0.001);

		this.mesh.name = this.type + '--' + this.action + '--' + this.id;

		this.createHeart();

    }

	createHeart() {

		let geometry = new THREE.IcosahedronGeometry(0.02);

		this.heartMaterial = new THREE.RawShaderMaterial({
			uniforms: {
				color: {
					type: 'c',
					value: this.color
				}
			},
			vertexShader: glslify('./../../../../../glsl/bonus/bonus-heart-vs.glsl'),
			fragmentShader: glslify('./../../../../../glsl/bonus/bonus-heart-fs.glsl'),
			side: THREE.DoubleSide,
			fog: true
		});

		this.heart = new THREE.Mesh(geometry, this.heartMaterial);

		this.mesh.add(this.heart);

	}

    updateMeshPosition(x, y, z) {

        this.mesh.position.set(x, y, z);

		// this.mesh.rotation.set(45, 45, 45);
		//
		// this.heart.rotation.set(60, 60, 60);

    }

	update() {

		this.heart.rotation.x -= 0.01;
		this.heart.rotation.y += 0.01;

		this.material.uniforms.time.value = this.time/1000;

		this.time++;

	}

	enter() {

		TweenMax.to(this.mesh.scale, 0.3, {
			x: 1,
			y: 1,
			z: 1,
			ease: Power2.easeOut
		});

	}

	leave() {

		TweenMax.to(this.mesh.scale, 0.3, {
			x: 0.001,
			y: 0.001,
			z: 0.001,
			ease: Power2.easeIn
		});

	}

}

export default Bonus;
