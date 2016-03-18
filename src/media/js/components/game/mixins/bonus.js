'use strict';

// import THREE from 'three';

import Bonus from '../models/bonus';

export default {

    created: function() {

		// Bonus

	},

	methods: {

		bonusInitialize: function() {

            this.bonusInitPositions();

            this.bonuses = [];

            this.bonuses.push(new Bonus('own', -1, 0.5, -1));

            this.bonuses.push(new Bonus('own', -2, 0.5, -2));

            this._collidableMeshBonus.push(this.bonuses[0].mesh);

            this._collidableMeshBonus.push(this.bonuses[1].mesh);

            this._scene.add(this.bonuses[0].mesh);

            this._scene.add(this.bonuses[1].mesh);

		},

		bonusUpdate: function() {

            this.bonuses[0].mesh.rotation.y -= 0.02;

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
