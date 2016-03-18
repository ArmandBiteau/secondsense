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

            this.bonuses.push(new Bonus('me', 'speedup', -1, 0.5, -1));

            this.bonuses.push(new Bonus('opponents', 'shader', -2, 0.5, -2));

            this._collidableMeshBonus.push(this.bonuses[0].mesh);

            this._collidableMeshBonus.push(this.bonuses[1].mesh);

            this._scene.add(this.bonuses[0].mesh);

            this._scene.add(this.bonuses[1].mesh);

		},

		bonusUpdate: function() {

            this.bonuses[0].mesh.rotation.y -= 0.02;

            this.bonuses[1].mesh.rotation.y -= 0.02;

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

        getRandomBonusPosition: function() {

                var n = Math.floor(Math.random() * this.bonusAvailablePositions.length);

                return this.bonusAvailablePositions[n];

        },

        bonusById: function(id) {

            for (let i = 0; i < this.bonuses.length; i++) {

                if (this.bonuses[i].id === id) {

                    return this.bonuses[i];

                }

            }

            return false;

        },

        mixinRemoveBonus: function(id) {

            console.log('remove bonus');

            let selectedObject = this._scene.getObjectByName(id);

            this._scene.remove(selectedObject);

            let objectToDelete = this._collidableMeshBonus.indexOf(selectedObject);

    	    if (objectToDelete !== -1) {

    	    	this._collidableMeshBonus.splice(objectToDelete, 1);

    	    }

			this.socket.emit('remove bonus', {id: id});

			setTimeout(() => {

				this.isEnableCollisionBonus = true;

			}, 2000);

		},

		mixinAddNewBonus: function(id) {

            var options = id.split('--');

			var type = options[0];
			var action = options[1];

            console.log('add bonus');

            var newPosition = this.getRandomBonusPosition();

            this.socket.emit('add bonus', {type: type, action: action, position: newPosition});

            var newBonus = new Bonus(type, action, newPosition.x, newPosition.y, newPosition.z);

            // console.log(type, action);

            // var newBonus = new Bonus(type, action, 0, 0.5, 0);

            this.bonuses.push(newBonus);

            this._collidableMeshBonus.push(newBonus.mesh);

            this._scene.add(newBonus.mesh);

		}

	}
};
