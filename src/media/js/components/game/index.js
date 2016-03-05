'use strict';

var ControlsMixin;

var glslify = require('glslify');

import Detectizr from '../../utils/detectizr';

import Vue from 'vue';

import THREE from 'three';

import Stats from 'stats';

import Emitter from '../../core/emitter';

// import FirstPersonControls from '../../core/fpsControls';

import gameScoreComponent from '../game-score';

import gameEndComponent from '../game-end';

import SoundEmitterMixin from './mixins/sound-emitter';

import ControlsDesktopMixin from './mixins/controls/desktop';

import ControlsMobileMixin from './mixins/controls/mobile';

if (Detectizr.device.type === 'desktop') {

	ControlsMixin =  ControlsDesktopMixin;

} else {

	ControlsMixin =  ControlsMobileMixin;

}

import TerrainMixin from './mixins/terrain';

import CubeMixin from './mixins/cube';

import OpponentsMixin from './mixins/opponents';

import LightsMixin from './mixins/lights';

export default Vue.extend({

	template: require('./template.html'),

	props: {

		socket: {
			type: Object,
			required: true
		},

		me: {
			type: Object,
			required: true
		},

		GameRoom: {
			type: Object,
			required: true
		}

	},

	data: function() {

		return {

			device: '',

			isGameComplete: false,

			_scene: null,

			isSceneLoaded: false,

			_renderer: null,

			_controls: null,

			_ray: null,

			_collidableMeshList: null,

			// Camera

			_camera: null,

			_listener: null,

			// Clock

			_clock: null,

			_clockElapsedTime: 0,

			_stats: null,

			_raf: null,

			// Effect

			_effect: null,

			_manager: null,

			_scoreContainer: null,

			opponents: [{
				id: '',
				name: '',
				color: '',
				gems: 0,
				x: 0,
				y: 0,
				z: 0
			}]

		};

	},

	created: function() {

		this._clock = new THREE.Clock(true);

		// this.me = {
		// 	id: '1234',
		// 	name: 'Armand Bto'
		// };
		//
		// this.GameRoom = {
		// 	id: 'testroom',
		// 	name: 'My room',
		// 	maxPlayers: 5,
		// 	players: [{
		// 		id: '1234',
		// 		name: 'Armand Bto',
		// 		score: {
		// 			sum_score: 12
		// 		},
		// 		gems: 1,
		// 		picture: 'https://pbs.twimg.com/profile_images/606867814025162752/Q3_J5qKH.jpg'
		// 	},{
		// 		id: '1234',
		// 		name: 'Denis Tribouillois',
		// 		score: {
		// 			sum_score: 20
		// 		},
		// 		gems: 3,
		// 		picture: 'https://pbs.twimg.com/profile_images/606867814025162752/Q3_J5qKH.jpg'
		// 	},{
		// 		id: '1234',
		// 		name: 'Jordi Bastide',
		// 		score: {
		// 			sum_score: 14
		// 		},
		// 		gems: 0,
		// 		picture: 'https://pbs.twimg.com/profile_images/606867814025162752/Q3_J5qKH.jpg'
		// 	}]
		// };

		this.bind();

	},

	ready: function() {

		this.device = Detectizr.device.type;

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

			Emitter.on('GAME_END_REQUEST', this.onGameCompleted);

			Emitter.on('GET_GEM', this.onGemCatch);

			this.socket.on('update gem position', this.onUpdateGemPosition);

		},

		removeEventListener: function() {

		},

		sceneInitialize: function() {

			// Parameters

			this._collidableMeshList = [];

			this._collidableMeshDiamond = [];

			// Scene

			this._scene = new THREE.Scene();

			// this._scene.fog = new THREE.Fog(0x181d21, 0, 10);

			// Camera

			this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

			this._camera.position.set(0, 0.25, 0);

			this._listener = new THREE.AudioListener();

			this._camera.add(this._listener);

			// Score

			this._scoreContainer = new THREE.CSS3DObject(document.getElementById('game-score-wrapper'));

			this._scoreContainer.rotation.x = 0.8;

			this._scene.add(this._scoreContainer);

			// Renderer

			this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});

			this._renderer.setPixelRatio(window.devicePixelRatio);

			this._renderer.setSize(window.innerWidth, window.innerHeight);

			this._renderer.setClearColor(0x181d24, 1);

			document.getElementById('game-canvas').appendChild(this._renderer.domElement);

			// Effect if VR

			if (this.device !== 'desktop') {

				this._VReffect = new THREE.VREffect(this._renderer);

				this._VReffect.setSize(window.innerWidth, window.innerHeight);

				this._VRmanager = new WebVRManager(this._renderer, this._VReffect, {hideButton: false});

			}

			this.sceneLoad();

		},

		sceneLoad: function() {

			// new THREE.JSONLoader().load(PATH_MODELS + '/labyrinthe.json', this.onSceneLoaded);

			this.onSceneLoaded();
		},

		onSceneLoaded: function() {

			this.isSceneLoaded = true;

			this.controlsInitialize();

			this.soundEmitterInitialize();

			this.terrainInitialize();

			this.lightInitialize();

			this.opponentsInitialize();

			if (this.device === 'desktop') {

				this.effectsInitialize();

			}

		},

		effectsInitialize: function() {

			this._composer = new WAGNER.Composer(this._renderer, {useRGBA: true});

			this._ssaoPass = new WAGNER.SSAOPass();
			this._ssaoPass.params.onlyOcclusion = true;

			this._composer.setSize(window.innerWidth, window.innerHeight);

			this._depthMaterial = new THREE.MeshBasicMaterial();
			this._depthMaterial = new THREE.ShaderMaterial({
				uniforms: {
					mNear: { type: 'f', value: this._camera.near },
					mFar: { type: 'f', value: this._camera.far }
				},
				vertexShader: glslify('./../../../glsl/vertex-shaders/packed-depth-vs.glsl'),
				fragmentShader: glslify('./../../../glsl/fragment-shaders/packed-depth-fs.glsl'),
				shading: THREE.SmoothShading
			});

			this._depthTexture = WAGNER.Pass.prototype.getOfflineTexture(window.innerWidth, window.innerHeight, true);

		},

		run: function() {

			this._raf = window.requestAnimationFrame(this.run);

			this.update();

			this.render();
		},

		update: function() {

			this._clockElapsedTime = this._clock.getElapsedTime();

			this.controlsUpdate();

			this.soundEmitterUpdate();

			this.terrainUpdate();

			this.lightsUpdate();

			this.opponentsUpdate();

		},

		render: function() {

			this._stats.begin();

			this._renderer.autoClearColor = true;

			if (this.device === 'desktop') {

				this._composer.reset();

				// this._scene.overrideMaterial = this._depthMaterial;

				this._composer.renderer.clear();

				// this._composer.render(this._scene, this._camera, null, this._depthTexture);
				//
				// this._ssaoPass.params.texture = this._depthTexture;
				//
				// this._scene.overrideMaterial = null;

				this._composer.render(this._scene, this._camera);

				// this._composer.pass(this._ssaoPass);

				this._composer.toScreen();

			} else {

				this._VRmanager.render(this._scene, this._camera);

			}

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

		playerById: function(id) {

			for (let i = 0; i < this.GameRoom.players.length; i++) {

				if (this.GameRoom.players[i].id === id) {

					return this.GameRoom.players[i];

				}

			}

			return false;

		},

		onGemCatch: function(id) {

			if (!this.isGameComplete) {

				let player = this.playerById(id);
				player.gems++;

				let opp = this.opponentById(id);
				opp.addGem();

				this.socket.emit('add player gem', {id: this.me.id});

				this.changeGemPosition();

			}

		},

		changeGemPosition: function() {

			Emitter.emit('SOUND_MANAGER_REQUEST_SOUND_GETGEM');

			var newPosition = this.getRandomSoundEmitterPosition(this.soundEmitter.position);

			this.socket.emit('update gem position', newPosition);

			TweenMax.to(this.soundEmitter.scale, 0.1, {
				x: 0.001,
				y: 0.001,
				z: 0.001,
				ease: Power2.easeIn,
				onComplete: () => {

					// Change position
					this.soundEmitter.position.x = newPosition.x;
					this.soundEmitter.position.y = newPosition.y;
					this.soundEmitter.position.z = newPosition.z;

					// Give back its scale
					TweenMax.to(this.soundEmitter.scale, 0.3, {
						x: 1,
						y: 1,
						z: 1,
						ease: Power2.easeOut
					});

				}

			});

			setTimeout(() => {

				this.isEnableCollisionDiamond = true;

			}, 1000);

		},

		onUpdateGemPosition(data) {

			Emitter.emit('SOUND_MANAGER_REQUEST_SOUND_GETGEM');

			TweenMax.to(this.soundEmitter.scale, 0.1, {
				x: 0.001,
				y: 0.001,
				z: 0.001,
				ease: Power2.easeIn,
				onComplete: () => {

					// Change position
					this.soundEmitter.position.x = data.x;
					this.soundEmitter.position.y = data.y;
					this.soundEmitter.position.z = data.z;

					// Give back its scale
					TweenMax.to(this.soundEmitter.scale, 0.3, {
						x: 1,
						y: 1,
						z: 1,
						ease: Power2.easeOut
					});

				}
			});

			setTimeout(() => {

				this.isEnableCollisionDiamond = true;

			}, 1000);

		},

		updateGems: function() {

		},

		onGameCompleted: function() {

			this.isGameComplete = true;

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

		ControlsMixin,
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
