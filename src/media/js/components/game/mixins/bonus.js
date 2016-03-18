'use strict';

import THREE from 'three';

export default {

    created: function() {

		// Bonus

		this.bonus = null;

		this._bonusColor = '#FFFFFF';

		this._bonusPositionInitial = new THREE.Vector3(-1, 0, -1);

	},

	methods: {

		bonusInitialize: function() {

            //this.bonusInitPositions();

            let geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);

            let material = new THREE.MeshPhongMaterial({ color: 0x0066FF, shininess: 30, shading: THREE.FlatShading });

            this.bonus = new THREE.Mesh(geometry, material);

            let dimensions = new THREE.Box3().setFromObject(this.bonus);

            this.bonus.position.set(this._bonusPositionInitial.x, this._bonusPositionInitial.y + dimensions.max.y + 0.5, this._bonusPositionInitial.z);

            this.bonus.rotation.set(45, 45, 45);

            this._collidableMeshBonus.push(this.bonus);

            this._scene.add(this.bonus);

            // this._sound = new THREE.Audio(this._listener);

            // let randomSound = Math.floor(Math.random() * 3) + 1;

            // this._sound.load('/media/sounds/'+randomSound+'.ogg');

            // this._sound.load('/media/sounds/lazerkut.mp3');

            // this._sound.setRefDistance(10);

            // this._sound.autoplay = true;

            // this._sound.loop = true;

			// this.bonus.add(this._sound);

		},

		bonusUpdate: function() {

            this.bonus.rotation.y -= 0.02;

		},

        bonusInitPositions: function() {

            this.bonusAvailablePositions = [{
                x: 0,
                y: 0.5,
                z: 1
            },{
                x: 0,
                y: 0.5,
                z: 2
            },{
                x: 0,
                y: 0.5,
                z: 3
            },{
                x: 0,
                y: 0.5,
                z: 4
            },{
                x: 0,
                y: 0.5,
                z: 5
            },{
                x: 0,
                y: 0.5,
                z: 6
            },{
                x: 0,
                y: 0.5,
                z: 7
            },{
                x: 0,
                y: 0.5,
                z: 8
            },{
                x: 0,
                y: 0.5,
                z: 9
            },{
                x: 0,
                y: 0.5,
                z: 10
            },{
                x: 0,
                y: 0.5,
                z: 11
            },{
                x: 0,
                y: 0.5,
                z: 12
            },{
                x: 0,
                y: 0.5,
                z: 13
            }];

        },

        getRandombonusPosition: function(exceptElement) {

                var n = Math.floor(Math.random() * this.bonusAvailablePositions.length);

                if (this.bonusAvailablePositions[n] === exceptElement) {

                    n = (n + Math.floor(Math.random() * this.bonusAvailablePositions.length)) % this.bonusAvailablePositions.length;

                }

                return this.bonusAvailablePositions[n];

        }

	}
};
