'use strict';

import THREE from 'three';

var uniforms = {

      time: { type: 'f', value: 1.0 },

      resolution: { type: 'v2', value: new THREE.Vector2()
}};

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

            let borders = new THREE.Geometry();

            let border1 = new THREE.Mesh(new THREE.CubeGeometry(2,this._terrainSize,2));

            border1.position.set(this._terrainSize / 2, 0, 1);

            THREE.GeometryUtils.merge(borders, border1);

            let border2 = new THREE.Mesh(new THREE.CubeGeometry(2,this._terrainSize,2));

            border2.position.set(-this._terrainSize / 2, 0, 1);

            THREE.GeometryUtils.merge(borders, border2);

            let border3 = new THREE.Mesh(new THREE.CubeGeometry(this._terrainSize,2,2));

            border3.position.set(0, this._terrainSize / 2, 1);

            THREE.GeometryUtils.merge(borders, border3);

            let border4 = new THREE.Mesh(new THREE.CubeGeometry(this._terrainSize,2,2));

            border4.position.set(0, -this._terrainSize / 2, 1);

            THREE.GeometryUtils.merge(borders, border4);

            let bordersMaterial = new THREE.MeshBasicMaterial(this._bordersColor);

            this._borders = new THREE.Mesh(borders, bordersMaterial);

            this._borders.rotation.x = -Math.PI / 2;

            this._collidableMeshList.push(this._borders);

      this._scene.add(this._borders);

            // Obstacles

            let obstacles = new THREE.Geometry();

            let i;

            for (i = 0; i < 15; i++) {

                    let obstacle = new THREE.Mesh(new THREE.CubeGeometry(Math.random()*3,Math.random()*3,Math.random()*6));

                    obstacle.position.set((Math.random() * 2 - 1) * this._terrainSize / 2, (Math.random() * 2 - 1) * this._terrainSize / 2, 0.5);

                    obstacle.rotation.set(Math.floor(Math.random() * 90), Math.floor(Math.random() * 90), Math.floor(Math.random() * 90));

                    THREE.GeometryUtils.merge(obstacles, obstacle);

            }

            let vertexShader = 'varying vec2 vUv;void main(){vUv = uv;vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );gl_Position = projectionMatrix * mvPosition;}';

            let fragmentShader = 'uniform float time;uniform vec2 resolution;varying vec2 vUv;void main( void ) {vec2 position = -1.0 + 2.0 * vUv;float red = abs( sin( position.x * position.y + time / 5.0 ) );float green = abs( sin( position.x * position.y + time / 4.0 ) );float blue = abs( sin( position.x * position.y + time / 3.0 ) );gl_FragColor = vec4( red, green, blue, 1.0 );}';

            let obstaclesMaterial = new THREE.ShaderMaterial(
                    {

                      uniforms: uniforms,

                      vertexShader: vertexShader,

                      fragmentShader: fragmentShader

                    });

            this._obstacles = new THREE.Mesh(obstacles, obstaclesMaterial);

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

            uniforms.time.value += 0.1;

		}
	}
};
