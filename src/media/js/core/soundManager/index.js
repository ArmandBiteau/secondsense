'use strict';

/* global createjs */

import Emitter from '../emitter';

var Sound = createjs.Sound;

import {
	SOUND_AMBIANCE,
	SOUND_CLICK,
	SOUND_GEM,
    PATH_SOUNDS
} from '../config';

class SoundManager {

	constructor() {

		this.muteForced = false;

		this.bind();

		Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);

		createjs.HTMLAudioPlugin.enableIOS = true;

		Sound.alternateExtensions = ['ogg', 'wav'];

		this.manifest = [
			{
				id: SOUND_AMBIANCE,
				src: PATH_SOUNDS + '/' + SOUND_AMBIANCE + '.mp3',
				data: 1
			},{
				id: SOUND_CLICK,
				src: PATH_SOUNDS + '/' + SOUND_CLICK + '.mp3',
				data: 2
			},{
				id: SOUND_GEM,
				src: PATH_SOUNDS + '/' + SOUND_GEM + '.mp3',
				data: 3
			}
		];
	}

	bind() {

		this.toogleSound = this.toogleSound.bind(this);

	}

	addEventListener() {

		Emitter.on('NEW_GAME_REQUEST', this.onNewGamerequested);

		Emitter.on('NEW_GAME_AS_GUEST_REQUEST', this.onNewGamerequested);

		Emitter.on('SOUND_MANAGER_REQUEST_SOUND_TOGGLE', this.toogleSound);

		Emitter.on('SOUND_MANAGER_REQUEST_SOUND_CLICK', this.onClickrequested);

		Emitter.on('SOUND_MANAGER_REQUEST_SOUND_GETGEM', this.onGemrequested);

	}

	removeEventListener() {

		Emitter.off('SOUND_MANAGER_REQUEST_SOUND_TOGGLE', this.toogleSound);

		Emitter.off('SOUND_MANAGER_REQUEST_SOUND_CLICK', this.onClickrequested);

		Emitter.off('SOUND_MANAGER_REQUEST_SOUND_GETGEM', this.onGemrequested);

	}

	start() {

		this.addEventListener();

		let i = this.manifest.length;

		return new Promise((resolve, reject) => {

			function onFileload() {

				i--;

				if (i === 0) {

					// Sound.play(SOUND_AMBIANCE);
					resolve();
				}
			}

			function onFileerror({ type, src}) {

				reject({
					type: type,
					src: src
				});
			}

			Sound.addEventListener('fileload', onFileload);

			Sound.addEventListener('fileerror', onFileerror);

			Sound.registerSounds(this.manifest);
		});
	}

	onNewGamerequested() {

		Sound.stop(SOUND_AMBIANCE);

	}

	toogleSound() {

		if (this.isSoundMuted) {

			this.unmute();

		} else {

			this.mute();
		}
	}

	mute() {

	}

	unmute() {

	}

	onClickrequested() {

		Sound.play(SOUND_CLICK);

	}

	onGemrequested() {

		Sound.play(SOUND_GEM);

	}

	destroy() {

		this.removeEventListener();
	}
}

export default new SoundManager();
