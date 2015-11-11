'use strict';

var Vue = require('vue');

var THREE = require('three');

var Stats = require('stats');

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

			isSceneLoaded: false,

			_renderer: null,

			_controls: null,

			// Camera

			_camera: null,

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

			window.addEventListener('resize', this.onWindowResize);

		},

		removeEventListener: function() {

		},

		sceneInitialize: function() {

			// Scene

			this._scene = new THREE.Scene();

			// this._scene.fog = new THREE.Fog(0x000000, 1, 100);

			// Camera

			this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

			this._camera.position.set(0, 0, 0);

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

			this.lightsUpdate();

			this.cubeUpdate();

		},

		cameraUpdate: function() {

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

		CubeMixin,

		LightsMixin

	],

	components: {

		gameScoreComponent: require('../game-score'),

		gameEndComponent: require('../game-end')

	}

});
