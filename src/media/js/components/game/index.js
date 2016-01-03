'use strict';

import Vue from 'vue';

import THREE from 'three';

import Stats from 'stats';

import gameScoreComponent from '../game-score';

import gameEndComponent from '../game-end';

import SoundEmitterMixin from './mixins/sound-emitter';

import TerrainMixin from './mixins/terrain';

import CubeMixin from './mixins/cube';

import OpponentsMixin from './mixins/opponents';

import LightsMixin from './mixins/lights';

export default Vue.extend({

	template: require('./template.html'),

	data: function() {

		return {

			isGameComplete: false,

			_scene: null,

			_collidableMeshList: [],

			isSceneLoaded: false,

			_renderer: null,

			_controls: null,

			// Camera

			_camera: null,

			_cameraBox: null,

			_listener: null,

			_distanceMove: 0,

			// Clock

			_clock: null,

			_clockElapsedTime: 0,

			_stats: null,

			_raf: null,

			// Effect

			_effect: null,

			_manager: null,

			_scoreContainer: null

		};

	},

	created: function() {

		this._clock = new THREE.Clock(true);

		this.bind();

	},

	ready: function() {

		window.WebVRConfig = {

			PREVENT_DISTORTION: true // Default: false.

		};

		this.sceneInitialize();

        this.addEventListener();

	},

	beforeDestroy: function() {

		this.stop();

		this.destroyStats();

	},

	watch: {

		isSceneLoaded: {

			handler(value) {

				if (value) {

					this.start();
				}
			},

			immediate: true
		}

	},

	methods: {

		/*
		 * Binding & Events
		*/

		bind: function() {

			this.run = this.run.bind(this);

		},

		addEventListener: function() {

			document.addEventListener('resize', this.onWindowResize);

			document.getElementsByTagName('canvas')[0].addEventListener('mousedown', this.moveForward, false);

		},

		removeEventListener: function() {

		},

		sceneInitialize: function() {

			// Parameters

			this._collidableMeshList = [];

			// Scene

			this._scene = new THREE.Scene();

			//this._scene.fog = new THREE.FogExp2(0x1c1c1c, 1.2);

			// Camera

			this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

			this._camera.position.set(0, 0.5, 0);

			this._listener = new THREE.AudioListener();

			this._camera.add(this._listener);

			let cameraBoxGeometry = new THREE.SphereGeometry(0.3, 5, 5);

            let cameraBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00});

            this._cameraBox = new THREE.Mesh(cameraBoxGeometry, cameraBoxMaterial);

            this._cameraBox.position.set(this._camera.position.x, this._camera.position.y, this._camera.position.z);

			this._scene.add(this._cameraBox);

			// Controls

			this._controls = new THREE.VRControls(this._camera);

			// Score

			this._scoreContainer = new THREE.CSS3DObject(document.getElementById('game-score-wrapper'));

			this._scene.add(this._scoreContainer);

			// Renderer

			this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});

			this._renderer.setPixelRatio(window.devicePixelRatio);

			this._renderer.setSize(window.innerWidth, window.innerHeight);

			this._renderer.setClearColor(0xffffff, 0);

			document.getElementById('game-canvas').appendChild(this._renderer.domElement);

			// Effect

			this._effect = new THREE.VREffect(this._renderer);

			this._effect.setSize(window.innerWidth, window.innerHeight);

			this._manager = new WebVRManager(this._renderer, this._effect, {hideButton: false});

			this.sceneLoad();

		},

		sceneLoad: function() {

			// new THREE.JSONLoader().load(PATH_MODELS + '/labyrinthe.json', this.onSceneLoaded);

			this.onSceneLoaded(); //toDelete
		},

		onSceneLoaded: function() {

			this.isSceneLoaded = true;

			this.soundEmitterInitialize();

			this.terrainInitialize();

			this.lightInitialize();

			this.opponentsInitialize(4);

		},

		run: function() {

			this._raf = window.requestAnimationFrame(this.run);

			this.update();

			this.render();
		},

		update: function() {

			this._clockElapsedTime = this._clock.getElapsedTime();

			this.cameraUpdate();

			this.soundEmitterUpdate();

			this.terrainUpdate();

			this.lightsUpdate();

			let posArray = [new THREE.Vector3(1, 0.4, 1), new THREE.Vector3(-1, 0.4, -1), new THREE.Vector3(-1, 0.4, 1), new THREE.Vector3(1, 0.4, -1)];

			this.opponentsUpdate(posArray);

		},

		cameraUpdate: function() {

			this._cameraBox.position.set(this._camera.position.x, this._camera.position.y, this._camera.position.z);

		},

		render: function() {

			this._stats.begin();

			this._controls.update();

			this._manager.render(this._scene, this._camera);

			// this._renderer.render(this._scene, this._camera);

			this._renderer.autoClearColor = true;

			this._stats.end();
		},

		initStats: function() {

			this._stats = new Stats();

			this._stats.setMode(0);

			this._stats.domElement.style.position = 'absolute';

			this._stats.domElement.style.left = '0px';

			this._stats.domElement.style.top = '30px';

			document.body.appendChild(this._stats.domElement);
		},

		destroyStats: function() {

			this._stats.domElement.parentNode.removeChild(this._stats.domElement);

		},

		onWindowResize: function() {

			this._camera.aspect = window.innerWidth / window.innerHeight;

			this._camera.updateProjectionMatrix();

			this._renderer.setSize(window.innerWidth, window.innerHeight);

		},

		canMoveForward: function() {

			let vector = new THREE.Vector3(0, 0, -1);

			let cameraLookVector = vector.applyQuaternion(this._camera.quaternion);

			let originPoint = this._cameraBox.position.clone();

			 // console.log(originPoint);

			originPoint = new THREE.Vector3(originPoint.x + cameraLookVector.x * 0.5, originPoint.y, originPoint.z + cameraLookVector.z * 0.5);

			// console.log(originPoint);

			for (let vertexIndex = 0; vertexIndex < this._cameraBox.geometry.vertices.length; vertexIndex++) {

				let localVertex = this._cameraBox.geometry.vertices[vertexIndex].clone();

				let globalVertex = localVertex.applyMatrix4(this._cameraBox.matrix);

				let directionVector = globalVertex.sub(this._cameraBox.position);

				let ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());

				let collisionResults = ray.intersectObjects(this._collidableMeshList);

				if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {

					return false;

				}

			}

			return true;

		},

		moveForward: function() {

			this._distanceMove = 0.5;

			let canMove = this.canMoveForward();

			if (canMove) {

				this._camera.translateZ(-this._distanceMove);

				this._camera.position.y = 0.5;

			}

		},

		/*
		 * Start & stop
		*/

		start: function() {

			if (!this._raf) {

				this._raf = window.requestAnimationFrame(this.run);

				this.initStats();
			}
		},

		stop: function() {

			this.removeEventListener();

			this.cancelAnimationFrame();

		},

		cancelAnimationFrame: function() {

			if (typeof (this._raf !== 'undefined') && this._raf !== null) {

				window.cancelAnimationFrame(this._raf);

				this._raf = null;
			}
		}

	},

	mixins: [

		TerrainMixin,

		CubeMixin,

		OpponentsMixin,

		LightsMixin,

		SoundEmitterMixin

	],

	components: {

		gameScoreComponent,
		gameEndComponent

	},

	transitions: {

		'game': {

			beforeEnter: function() {

			},

			enter: function() {

			},

			beforeLeave: function() {

				this.stop();

			},

			leave: function() {

				this.stop();

			}

		}

	}

});
