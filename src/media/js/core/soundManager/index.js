'use strict';

/* global createjs */

import Emitter from '../emitter';

var Sound = createjs.Sound;

import {
	SOUND_AMBIANCE,
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
			}
		];
	}

	bind() {

		this.toogleSound = this.toogleSound.bind(this);

	}

	addEventListener() {

		Emitter.on('SOUND_MANAGER_REQUEST_SOUND_TOGGLE', this.toogleSound);

	}

	removeEventListener() {

		Emitter.off('SOUND_MANAGER_REQUEST_SOUND_TOGGLE', this.toogleSound);

	}

	start() {

        console.log('Sound start');

		this.addEventListener();

		let i = this.manifest.length;

		return new Promise((resolve, reject) => {

			function onFileload() {

				i--;

				if (i === 0) {

					Sound.play('ambiance');
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

	destroy() {

		this.removeEventListener();
	}
}

export default new SoundManager();
