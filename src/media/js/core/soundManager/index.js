'use strict';

/* global createjs */

import Emitter from '../emitter';

var Sound = createjs.Sound;

import {
	SOUND_AMBIANCE,
	SOUND_CLICK,
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
			},
			{
				id: SOUND_CLICK,
				src: PATH_SOUNDS + '/' + SOUND_CLICK + '.mp3',
				data: 2
			}
		];
	}

	bind() {

		this.toogleSound = this.toogleSound.bind(this);

	}

	addEventListener() {

		Emitter.on('SOUND_MANAGER_REQUEST_SOUND_TOGGLE', this.toogleSound);

		Emitter.on('SOUND_MANAGER_REQUEST_SOUND_CLICK', this.onClickrequested);

	}

	removeEventListener() {

		Emitter.off('SOUND_MANAGER_REQUEST_SOUND_TOGGLE', this.toogleSound);

		Emitter.off('SOUND_MANAGER_REQUEST_SOUND_CLICK', this.onClickrequested);

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

	destroy() {

		this.removeEventListener();
	}
}

export default new SoundManager();
