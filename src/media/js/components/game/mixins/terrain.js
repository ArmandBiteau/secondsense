'use strict';

import THREE from 'three';

export default {

    created: function() {

		// Terrain

		this._ground = null;

        this._groundColor = {color: 0x2c2c2c};

		this._borders = null;

        this._bordersColor = {color: 0x3399FF};

        this._obstacles = null;

        this._obstaclesColor = {color: 0xCC6600};

		this._terrainPositionInitial = new THREE.Vector3(0, 0, 0);

        this._terrainSize = 20;

	},

	methods: {

		terrainInitialize: function() {

            // Ground

            let ground = new THREE.PlaneGeometry(this._terrainSize, this._terrainSize);

            let groundMaterial = new THREE.MeshBasicMaterial(this._groundColor);

            this._ground = new THREE.Mesh(ground, groundMaterial);

            this._ground.position.set(this._terrainPositionInitial.x, this._terrainPositionInitial.y, this._terrainPositionInitial.z);

            this._ground.rotation.x = -Math.PI / 2;

			this._scene.add(this._ground);

            // Borders

            var bordersGeo = new THREE.Geometry();

            let border1Geo = new THREE.BoxGeometry(2, this._terrainSize, 2);
            let border1Mesh = new THREE.Mesh(border1Geo);
            border1Mesh.position.set(this._terrainSize / 2, 0, 1);

            let border2Geo = new THREE.BoxGeometry(2, this._terrainSize, 2);
            let border2Mesh = new THREE.Mesh(border2Geo);
            border2Mesh.position.set(-this._terrainSize / 2, 0, 1);

            let border3Geo = new THREE.BoxGeometry(this._terrainSize, 2, 2);
            let border3Mesh = new THREE.Mesh(border3Geo);
            border3Mesh.position.set(0, this._terrainSize / 2, 1);

            let border4Geo = new THREE.BoxGeometry(this._terrainSize, 2, 2);
            let border4Mesh = new THREE.Mesh(border4Geo);
            border4Mesh.position.set(0, -this._terrainSize / 2, 1);

            border1Mesh.updateMatrix();
            bordersGeo.merge(border1Mesh.geometry, border1Mesh.matrix);

            border2Mesh.updateMatrix();
            bordersGeo.merge(border2Mesh.geometry, border2Mesh.matrix);

            border3Mesh.updateMatrix();
            bordersGeo.merge(border3Mesh.geometry, border3Mesh.matrix);

            border4Mesh.updateMatrix();
            bordersGeo.merge(border4Mesh.geometry, border4Mesh.matrix);

            this._borders = new THREE.Mesh(bordersGeo, new THREE.MeshBasicMaterial(this._bordersColor));

            this._borders.rotation.x = -Math.PI / 2;

            this._collidableMeshList.push(this._borders);

            this._scene.add(this._borders);

            // Obstacles

            var obstaclesGeo = new THREE.Geometry();
            var obstaclesMat = new THREE.ShaderMaterial({
                uniforms: {
                      time: { type: 'f', value: 1.0 },
                      resolution: { type: 'v2', value: new THREE.Vector2() }
                },
                vertexShader: require('../../../../glsl/terrain-vs.glsl')(),
                fragmentShader: require('../../../../glsl/terrain-fs.glsl')()
            });

            for (let i = 0; i < 15; i++) {

                let obstacleGeo = new THREE.BoxGeometry(Math.random()*3, Math.random()*3, Math.random()*6);
                let obstacleMesh = new THREE.Mesh(obstacleGeo);

                obstacleMesh.position.set((Math.random() * 2 - 1) * this._terrainSize / 2, (Math.random() * 2 - 1) * this._terrainSize / 2, 0.5);
                obstacleMesh.rotation.set(Math.floor(Math.random() * 90), Math.floor(Math.random() * 90), Math.floor(Math.random() * 90));

                obstacleMesh.updateMatrix();
                obstaclesGeo.merge(obstacleMesh.geometry, obstacleMesh.matrix);

            }

            this._obstacles = new THREE.Mesh(obstaclesGeo, obstaclesMat);

            this._obstacles.rotation.x = -Math.PI / 2;

            this._collidableMeshList.push(this._obstacles);

            this._scene.add(this._obstacles);

            // Grid helper

            let helper = new THREE.GridHelper(40, 0.25);

  			helper.color1.setHex(0x6a6a6a);

  			helper.color2.setHex(0x6a6a6a);

  			helper.position.y = 0;

			this._scene.add(helper);

		},

		terrainUpdate: function() {

            this._obstacles.material.uniforms.time.value += 0.1;

		}
	}
};
