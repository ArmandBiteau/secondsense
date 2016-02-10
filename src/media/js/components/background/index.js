'use strict';

import Vue from 'vue';

import THREE from 'three';

import Stats from 'stats';

var glslify = require('glslify');

import CubeMixin from './mixins/cube';

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

		},

		addEventListener: function() {

			window.addEventListener('resize', this.onWindowResize);

		},

		removeEventListener: function() {

		},

		sceneInitialize: function() {

			// Parameters

			// Scene

			this._scene = new THREE.Scene();

			// this._scene.fog = new THREE.Fog(0x000000, 500, 1000);

			// Camera

			this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

			this._camera.position.set(0, 0, 1000);

			// Controls

			// this._controls = new THREE.pointerLockControls(this._camera);

			// Renderer

			this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});

			this._renderer.setPixelRatio(window.devicePixelRatio);

			this._renderer.setSize(window.innerWidth, window.innerHeight);

			this._renderer.setClearColor(0x4249d6, 0);

			document.getElementById('background-canvas').appendChild(this._renderer.domElement);

			// Effect

			this.sceneLoad();

		},

		sceneLoad: function() {

			this.onSceneLoaded();

		},

		onSceneLoaded: function() {

			this.isSceneLoaded = true;

			this.cubeInitialize();

			this.lightsInitialize();

			this.effectsInitialize();

		},

		effectsInitialize: function() {

			// this._depthMaterial = new THREE.MeshBasicMaterial();

			this._depthTexture = null;

			this._depthMaterial = new THREE.ShaderMaterial({
				uniforms: {
					mNear: { type: 'f', value: this._camera.near },
					mFar: { type: 'f', value: this._camera.far }
				},
				vertexShader: glslify('../../../glsl/vertex-shaders/packed-depth-vs.glsl'),
				fragmentShader: glslify('../../../glsl/fragment-shaders/packed-depth-fs.glsl'),
				shading: THREE.SmoothShading
			});

			this._composer = new WAGNER.Composer(this._renderer, {useRGBA: true});

			this._multiBloomPass = new WAGNER.MultiPassBloomPass();

			this._dofPass = new WAGNER.GuidedFullBoxBlurPass();

			this._vignette2Pass = new WAGNER.Vignette2Pass();

			this._fxaaPass = new WAGNER.FXAAPass();

			this._multiBloomPass.params.blurAmount = 2;

			this._dofPass.params.amount = 20;
			this._dofPass.params.invertBiasMap = true;
			// this._dofPass.params.from = 0.5;
			// this._dofPass.params.to = 1.0;

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

			this.cubeUpdate();

			this.lightsUpdate();

		},

		render: function() {

			this._stats.begin();

			// this._controls.update();

			// this._renderer.render(this._scene, this._camera);

			this._renderer.autoClearColor = true;

			this._composer.renderer.setClearColor(0x000000, 1);

			this._composer.reset();

			this._composer.renderer.clear();

			this._cube.material = this._depthMaterial;

			this._composer.render(this._scene, this._camera, null, this._depthTexture);

			this._cube.material = this._cubeMaterial;

			this._composer.render(this._scene, this._camera);

			this._dofPass.params.tBias = this._depthTexture;

			// this._composer.pass(this._multiBloomPass);

			// this._composer.pass(this._dofPass);

			this._composer.pass(this._vignette2Pass);

			// this._composer.pass(this._fxaaPass);

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

		onWindowResize: function() {

			this._camera.aspect = window.innerWidth / window.innerHeight;

			this._camera.updateProjectionMatrix();

			this._renderer.setSize(window.innerWidth, window.innerHeight);

			this._renderer.setClearColor(0x4249d6, 0);

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
