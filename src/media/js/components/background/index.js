'use strict';

import Vue from 'vue';

import THREE from 'three';

import Stats from 'stats';

// var glslify = require('glslify');

import CubeMixin from './mixins/cube';

import PlaneMixin from './mixins/plane';

import LightsMixin from './mixins/lights';

export default Vue.extend({

	template: require('./template.html'),

	data: function() {

		return {

			_scene: null,

			isSceneLoaded: false,

			_renderer: null,

			_controls: null,

			// Camera

			_camera: null,

			_mouseX: 0,

			_mouseY: 0,

			// Clock

			_clock: null,

			_clockElapsedTime: 0,

			_stats: null,

			_raf: null,

			// Effect

			_composer: null

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

			this.onWindowResize = this.onWindowResize.bind(this);

			this.onMouseMove = this.onMouseMove.bind(this);

		},

		addEventListener: function() {

			window.addEventListener('resize', this.onWindowResize);

			window.addEventListener('mousemove', this.onMouseMove);

		},

		removeEventListener: function() {

		},

		onWindowResize: function() {

			this._camera.aspect = window.innerWidth / window.innerHeight;

			this._camera.updateProjectionMatrix();

			this._renderer.setSize(window.innerWidth, window.innerHeight);

		},

		onMouseMove: function(event) {

			this._mouseX = (event.clientX - window.innerWidth/2);
			this._mouseY = (event.clientY - window.innerHeight/2);

		},

		sceneInitialize: function() {

			// Parameters

			this._mouseX = window.innerWidth/2;

			this._mouseY = window.innerHeight/2;

			// Scene

			this._scene = new THREE.Scene();

			// this._scene.fog = new THREE.Fog(0x000000, 500, 1000);

			// Camera

			this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 15000);

			this._camera.position.set(0, 0, 500);

			// Controls

			// this._controls = new THREE.pointerLockControls(this._camera);

			// Renderer

			this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});

			this._renderer.setPixelRatio(window.devicePixelRatio);

			this._renderer.setSize(window.innerWidth, window.innerHeight);

			this._renderer.setClearColor(0x070c10, 1);

			document.getElementById('background-canvas').appendChild(this._renderer.domElement);

			// Effect

			this.sceneLoad();

		},

		sceneLoad: function() {

			this.onSceneLoaded();

		},

		onSceneLoaded: function() {

			this.isSceneLoaded = true;

			this.planeInitialize();

			// this.cubeInitialize();

			this.lightsInitialize();

			this.effectsInitialize();

		},

		effectsInitialize: function() {

			this._composer = new WAGNER.Composer(this._renderer, {useRGBA: true});

			this._multiBloomPass = new WAGNER.MultiPassBloomPass();

			this._fxaaPass = new WAGNER.FXAAPass();

			this._vignettePass = new WAGNER.Vignette2Pass({
				boost: 1,
				reduction: 2
			});

			this._multiBloomPass.params.blurAmount = 2;

			this._composer.setSize(window.innerWidth, window.innerHeight);

			this._depthTexture = WAGNER.Pass.prototype.getOfflineTexture(window.innerWidth, window.innerHeight, true);

		},

		run: function() {

			this._raf = window.requestAnimationFrame(this.run);

			this.update();

			this.render();
		},

		update: function() {

			this._clockElapsedTime = this._clock.getElapsedTime();

			this.planeUpdate();

			// this.cubeUpdate();

			this.lightsUpdate();

		},

		render: function() {

			this._stats.begin();

			// this._controls.update();

			this._camera.position.x = (-this._mouseX) * 0.12;
			this._camera.position.y = this._mouseY * 0.15;

			if (this._camera.position.x < -120) {
				this._camera.position.x = -120;
			}

			if (this._camera.position.x > 120) {
				this._camera.position.x = 120;
			}

			if (this._camera.position.y < -150) {
				this._camera.position.y = -150;
			}

			if (this._camera.position.y > 150) {
				this._camera.position.y = 150;
			}

			this._camera.lookAt(this._scene.position);

			// this._renderer.render(this._scene, this._camera);

			this._renderer.autoClearColor = true;

			this._composer.reset();

			this._composer.renderer.clear();

			this._composer.render(this._scene, this._camera);

			this._composer.pass(this._fxaaPass);

			this._composer.pass(this._multiBloomPass);

			this._composer.pass(this._vignettePass);

			this._composer.toScreen();

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

		PlaneMixin,
		CubeMixin,
		LightsMixin

	],

	components: {

	},

	transitions: {

		'background': {

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
