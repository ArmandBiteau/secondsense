'use strict';

var Vue = require('vue');

var THREE = require('three');

var Stats = require('stats');

var SoundEmitterMixin = require('./sound-emitter');

var TerrainMixin = require('./terrain');

var CubeMixin = require('./cube');

var LightsMixin = require('./lights');

// var i18n = require('vue-i18n');

// var locales = require('../../core/i18n');

// var config = require('../../config');

module.exports = Vue.extend({

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

			_manager: null

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

			handler: function(value) {

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

			// document.getElementsByTagName('canvas')[0].addEventListener('mousedown', this.moveForward, false);

		},

		removeEventListener: function() {

		},

		sceneInitialize: function() {

			// Parameters

			this._collidableMeshList = [];

			// Scene

			this._scene = new THREE.Scene();

			this._scene.fog = new THREE.Fog(0x1c1c1c, 0, 1.5);

			// Camera

			this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

			this._camera.position.set(0, 0.5, 0);

			this._listener = new THREE.AudioListener();

			this._camera.add(this._listener);

			var cameraBoxGeometry = new THREE.SphereGeometry(0.3, 5, 5);

            var cameraBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00});

            this._cameraBox = new THREE.Mesh(cameraBoxGeometry, cameraBoxMaterial);

            this._cameraBox.position.set(this._camera.position.x, this._camera.position.y, this._camera.position.z);

			this._scene.add(this._cameraBox);

			// Controls

			this._controls = new THREE.VRControls(this._camera);

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

			this.cubeInitialize();

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

			this.cubeUpdate();

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

			var originPoint = this._cameraBox.position.clone();

			for (var vertexIndex = 0; vertexIndex < this._cameraBox.geometry.vertices.length; vertexIndex++) {

				var localVertex = this._cameraBox.geometry.vertices[vertexIndex].clone();

				var globalVertex = localVertex.applyMatrix4(this._cameraBox.matrix);

				var directionVector = globalVertex.sub(this._cameraBox.position);

				var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());

				var collisionResults = ray.intersectObjects(this._collidableMeshList);

				if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {

					return false;

				}

			}

			return true;

		},

		moveForward: function() {

			this._distanceMove = 0.1;

			var canMove = this.canMoveForward();

			console.log(canMove);

			if (canMove) {

				this._camera.translateZ(-this._distanceMove);

				this._camera.position.y = 0;

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

		LightsMixin,

		SoundEmitterMixin

	],

	components: {

		gameScoreComponent: require('../game-score'),

		gameEndComponent: require('../game-end')

	}

});
