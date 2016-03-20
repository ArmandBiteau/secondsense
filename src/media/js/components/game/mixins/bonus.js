'use strict';

// import THREE from 'three';

import Bonus from '../models/bonus';

export default {

    created: function() {

		// Bonus

	},

	methods: {

		bonusInitialize: function() {

            this.bonuses = [];

            setTimeout(() => {

                this.createStartingBonuses();

            }, 1000);

		},

        createStartingBonuses: function() {

            // 2 bonus de chaque type et action

            var bonusType = ['me', 'opponents'];
            var bonusAction = ['speedup', 'speeddown', 'shader'];

            this.bonuses.push(new Bonus('idtest1', bonusType[0], bonusAction[0], -5, 0.5, -1));
            this.bonuses.push(new Bonus('idtest2', bonusType[0], bonusAction[1], 7, 0.5, -3));
            this.bonuses.push(new Bonus('idtest3', bonusType[0], bonusAction[2], -13, 0.5, -11));
            this.bonuses.push(new Bonus('idtest4', bonusType[1], bonusAction[0], -1, 0.5, -1));
            this.bonuses.push(new Bonus('idtest5', bonusType[1], bonusAction[1], 15, 0.5, 9));
            this.bonuses.push(new Bonus('idtest6', bonusType[1], bonusAction[2], -7, 0.5, 15));

            // TWICE
            this.bonuses.push(new Bonus('idtest7', bonusType[0], bonusAction[0], -13, 0.5, -7));
            this.bonuses.push(new Bonus('idtest8', bonusType[0], bonusAction[1], -15, 0.5, -1));
            this.bonuses.push(new Bonus('idtest9', bonusType[0], bonusAction[2], 13, 0.5, -9));
            this.bonuses.push(new Bonus('idtest10', bonusType[1], bonusAction[0], 5, 0.5, 5));
            this.bonuses.push(new Bonus('idtest11', bonusType[1], bonusAction[1], -3, 0.5, 9));
            this.bonuses.push(new Bonus('idtest12', bonusType[1], bonusAction[2], -5, 0.5, -9));

            this.bonuses.forEach((object) => {

                this._collidableMeshBonus.push(object.mesh);
                this._scene.add(object.mesh);
                object.enter();

            });

        },

		bonusUpdate: function() {

            this.bonuses.forEach((object) => {

              object.update();

            });

		},

        mixinRemoveBonus: function(name) {

            // console.log('remove bonus');

            let selectedObject = this._scene.getObjectByName(name);

            let bonus = this.bonusByName(name);

            bonus.leave();

            setTimeout(() => {

				this._scene.remove(selectedObject);

			}, 300);

            let objectToDelete = this._collidableMeshBonus.indexOf(selectedObject);

    	    if (objectToDelete !== -1) {

    	    	this._collidableMeshBonus.splice(objectToDelete, 1);

    	    }

			this.socket.emit('remove bonus', {name: name});

			setTimeout(() => {

				this.isEnableCollisionBonus = true;

			}, 500);

		},

        onMixinRemoveBonus: function(data) {

            // console.log('remove bonus');

            let selectedObject = this._scene.getObjectByName(data.name);

            let bonus = this.bonusByName(data.name);

            bonus.leave();

            setTimeout(() => {

				this._scene.remove(selectedObject);

			}, 300);

            let objectToDelete = this._collidableMeshBonus.indexOf(selectedObject);

    	    if (objectToDelete !== -1) {

    	    	this._collidableMeshBonus.splice(objectToDelete, 1);

    	    }

			setTimeout(() => {

				this.isEnableCollisionBonus = true;

			}, 500);

		},

		mixinAddNewBonus: function(id) {

            var options = id.split('--');

			var type = options[0];
			var action = options[1];

            // console.log('add bonus');

            var newPosition = this.getRandomBonusPosition();

            let newid = (0|Math.random()*9e6).toString(36);

            this.socket.emit('add bonus', {id: newid, type: type, action: action, position: newPosition});

            var newBonus = new Bonus(newid, type, action, newPosition.x, newPosition.y, newPosition.z);

            this.bonuses.push(newBonus);

            this._collidableMeshBonus.push(newBonus.mesh);

            this._scene.add(newBonus.mesh);

            newBonus.enter();

		},

        onMixinAddNewBonus: function(data) {

            // console.log('add bonus');

            var newBonus = new Bonus(data.id, data.type, data.action, data.position.x, data.position.y, data.position.z);

            this.bonuses.push(newBonus);

            this._collidableMeshBonus.push(newBonus.mesh);

            this._scene.add(newBonus.mesh);

            newBonus.enter();

		},

        getRandomBonusPosition: function() {

            let avalablePositions = [-19, -17, -15, -13, -11, -9, -7, -5, -3, -1, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

            let posX = avalablePositions[Math.floor(Math.random() * 19)];

            let posZ = avalablePositions[Math.floor(Math.random() * 19)];

            return {
                x: posX,
                y: 0.5,
                z: posZ
            };

        },

        bonusById: function(id) {

            for (let i = 0; i < this.bonuses.length; i++) {

                if (this.bonuses[i].id === id) {

                    return this.bonuses[i];

                }

            }

            return false;

        },

        bonusByName: function(name) {

            for (let i = 0; i < this.bonuses.length; i++) {

                if (this.bonuses[i].mesh.name === name) {

                    return this.bonuses[i];

                }

            }

            return false;

        }

	}
};
