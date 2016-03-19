'use strict';

import THREE from 'three';

class Bonus {

	constructor(id, type, action, x, y, z) {

		this.id = id;

		this.type = type;

		this.action = action;

		this.x = x;

		this.y = y;

		this.z = z;

		this.color = null;

        this.createGeometry();

        this.createMaterial();

        this.createMesh();

        this.updateMeshPosition(x, y, z);

	}

    createGeometry() {

        this.geometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);

    }

    createMaterial() {

		let color;

		if (this.type === 'me') {

			color = new THREE.Color(0x00FF00);

		} else {

			color = new THREE.Color(0xFF0000);

		}

        this.material = new THREE.MeshLambertMaterial({color: color});

    }

    createMesh() {

        this.mesh = new THREE.Mesh(this.geometry, this.material);

		this.mesh.scale.set(0.001, 0.001, 0.001);

		this.mesh.name = this.type + '--' + this.action + '--' + this.id;

    }

    updateMeshPosition(x, y, z) {

        this.mesh.position.set(x, y, z);

		this.mesh.rotation.set(45, 45, 45);

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
