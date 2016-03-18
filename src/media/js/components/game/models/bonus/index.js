'use strict';

import THREE from 'three';

class Bonus {

	constructor(type, action, x, y, z) {

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

        this.geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);

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

		this.mesh.name = this.type + '--' + this.action + '--' + this.mesh.uuid;

    }

    updateMeshPosition(x, y, z) {

        this.mesh.position.set(x, y, z);

		this.mesh.rotation.set(45, 45, 45);

    }

}

export default Bonus;
