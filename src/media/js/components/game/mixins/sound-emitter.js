'use strict';

import THREE from 'three';

export default {

    created: function() {

		// Sound Emitter

		this.soundEmitter = null;

        this._sound = null;

		this._soundEmitterColor = '#FFFFFF';

		this._soundEmitterPositionInitial = new THREE.Vector3(2, 0.5, 0);

	},

	methods: {

		soundEmitterInitialize: function() {

            this.soundEmitterInitPositions();

            let geometry = new THREE.OctahedronGeometry(0.17, 0);

            let material = new THREE.MeshPhongMaterial({
                color: 0x4249d6,
                shading: THREE.FlatShading,
                specular: 0x4249d6,
                fog: true
            });

            this.soundEmitter = new THREE.Mesh(geometry, material);

            this.soundEmitter.position.set(this._soundEmitterPositionInitial.x, this._soundEmitterPositionInitial.y, this._soundEmitterPositionInitial.z);

            this._collidableMeshDiamond.push(this.soundEmitter);

            this._scene.add(this.soundEmitter);

            this._sound = new THREE.Audio(this._listener);

            // let randomSound = Math.floor(Math.random() * 3) + 1;

            // this._sound.load('/media/sounds/'+randomSound+'.ogg');

            this._sound.load('/media/sounds/lazerkut.mp3');

            this._sound.setRefDistance(10);

            this._sound.setVolume(0);

            this._sound.autoplay = true;

            this._sound.loop = true;

			this.soundEmitter.add(this._sound);

		},

		soundEmitterUpdate: function() {

            this.soundEmitter.rotation.y -= 0.02;

		},

        soundEmitterInitPositions: function() {

            this.soundEmitterAvailablePositions = [{
                x: 13,
                y: 0.5,
                z: -16
            },{
                x: -13,
                y: 0.5,
                z: -13
            },{
                x: 7,
                y: 0.5,
                z: -11
            },{
                x: -7,
                y: 0.5,
                z: -7
            },{
                x: 5,
                y: 0.5,
                z: -5
            },{
                x: 11,
                y: 0.5,
                z: -1
            },{
                x: -15,
                y: 0.5,
                z: 3
            },{
                x: -7,
                y: 0.5,
                z: 3
            },{
                x: 1,
                y: 0.5,
                z: 7
            },{
                x: -15,
                y: 0.5,
                z: 11
            },{
                x: 7,
                y: 0.5,
                z: 13
            },{
                x: 15,
                y: 0.5,
                z: 15
            },{
                x: -1,
                y: 0.5,
                z: 17
            }];

        },

        getRandomSoundEmitterPosition: function(exceptElement) {

                var n = Math.floor(Math.random() * this.soundEmitterAvailablePositions.length);

                if (this.soundEmitterAvailablePositions[n] === exceptElement) {

                    n = (n + Math.floor(Math.random() * this.soundEmitterAvailablePositions.length)) % this.soundEmitterAvailablePositions.length;

                }

                return this.soundEmitterAvailablePositions[n];

        },

        removeSoundEmitter: function() {

            this._sound = null;

            this.soundEmitter = null;

            this._scene.remove(this.soundEmitter);

        },

        mixinChangeSoundEmitterPosition: function(newPosition) {

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

        }

	}
};
