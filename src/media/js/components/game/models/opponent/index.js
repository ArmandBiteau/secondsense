'use strict';

import THREE from 'three';

class Opponent {

	constructor(id, name, color, x, y, z) {

		this.id = id;

		this.name = name;

        this.color = parseInt('0x'+color.substr(1));

		this.x = x;

		this.y = y;

		this.z = z;

		this.gems = 0;

        this.createGeometry();

        this.createMaterial();

        this.createMesh();

        // this.updateMeshXYZ(x, y, z);

        this.updateMeshPosition(x, y, z);

	}

    createGeometry() {

        this.geometry = new THREE.SphereGeometry(0.1, 8, 8);

    }

    createMaterial() {

		this.material = new THREE.MeshPhongMaterial({
			color: this.color,
			shading: THREE.FlatShading,
			fog: true
		});

    }

    createMesh() {

        this.mesh = new THREE.Mesh(this.geometry, this.material);

    }

    updateMeshXYZ(x, y, z) {

        this.x = x;

		this.y = y;

		this.z = z;

    }

    updateMeshPosition(x, y, z) {

        this.mesh.position.set(x, y, z);

    }

	addGem() {

		this.gems++;

	}

}

export default Opponent;
