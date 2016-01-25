'use strict';

import Vue from 'vue';

import THREE from 'three';

import Stats from 'stats';

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

		},

		addEventListener: function() {

			document.addEventListener('resize', this.onWindowResize);

		},

		removeEventListener: function() {

		},

		sceneInitialize: function() {

			// Parameters

			// Scene

			this._scene = new THREE.Scene();

			//this._scene.fog = new THREE.FogExp2(0x1c1c1c, 1.2);

			// Camera

			this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

			this._camera.position.set(0, 0, 0);

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

			this.glitchInitialize();

		},

		glitchInitialize: function() {

			this._composer = new THREE.EffectComposer(this._renderer);

			this._composer.addPass(new THREE.RenderPass(this._scene, this._camera));

			let rgbshift = new THREE.ShaderPass(THREE.RGBShiftShader);
			rgbshift.uniforms.amount.value = 0.0015;
			this._composer.addPass(rgbshift);

			let glitch = new THREE.GlitchPass();
			this._composer.addPass(glitch);
			glitch.renderToScreen = true;

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

			this._composer.render();

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
