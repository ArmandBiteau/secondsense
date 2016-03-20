'use strict';

import Vue from 'vue';

import Detectizr from '../../utils/detectizr';

import THREE from 'three';

import Stats from 'stats';

import PlaneMixin from './mixins/plane';

import CityMixin from './mixins/city';

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

			_mouseX: window.innerWidth/2,

			_mouseY: window.innerHeight/2,

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

		this.device = Detectizr.device.type;

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

			// this._scene.fog = new THREE.Fog(0x181d21, 500, 1000);

			// Camera

			this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 7000);

			this._camera.position.set(0, 0, 500);

			// Controls

			// this._controls = new THREE.pointerLockControls(this._camera);

			// Renderer

			this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});

			this._renderer.setPixelRatio(window.devicePixelRatio);

			this._renderer.setSize(window.innerWidth, window.innerHeight);

			this._renderer.setClearColor(0x181d24, 1);

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

			this.cityInitialize();

			this.lightsInitialize();

			this.effectsInitialize();

		},

		effectsInitialize: function() {

			this._composer = new WAGNER.Composer(this._renderer, {useRGBA: true});

			if (this.device === 'desktop') {

				this._fxaaPass = new WAGNER.FXAAPass();

				this._chromaticAberrationPass = new WAGNER.ChromaticAberrationPass();

				this._noisePass = new WAGNER.NoisePass();
				this._noisePass.params.amount = 0.05;
				this._noisePass.params.speed = 0.2;

				this._vignettePass = new WAGNER.VignettePass();
				this._vignettePass.params.amount = 0.7;
				this._vignettePass.params.falloff = 0.1;

			}

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

			this.cityUpdate();

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

			if (this.device === 'desktop') {

				this._composer.pass(this._fxaaPass);

				// this._composer.pass(this._chromaticAberrationPass);

				this._composer.pass(this._noisePass);

				this._composer.pass(this._vignettePass);

			}

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
		// CubeMixin,
		CityMixin,
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
