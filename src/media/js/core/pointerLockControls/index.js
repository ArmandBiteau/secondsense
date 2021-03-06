'use strict';

var THREE = window.THREE || require('three');

module.exports = function(camera) {

	var _this = this;

	_this.pitchObject = new THREE.Object3D();
	_this.pitchObject.add(camera);

	_this.yawObject = new THREE.Object3D();
	_this.yawObject.position.y = 0.5;
	_this.yawObject.add(_this.pitchObject);

	var moveForward = false;

	var isOnObject = false;
	var canJump = false;

	this.velocity = new THREE.Vector3();
	this.speed = 0.0025;

	// var bonusPickedUp = false;
	// var bonusEnd = false;

	var PI_2 = Math.PI / 2;

	var onMouseMove = function(event) {

		if (_this.enabled === false) return;

		var movementX = event.movementX || event.mozMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || 0;

		_this.yawObject.rotation.y -= movementX * 0.002;

		_this.pitchObject.rotation.x -= movementY * 0.002;
		_this.pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, _this.pitchObject.rotation.x));

	};

	var onKeyDown = function(event) {

		switch (event.keyCode) {

			case 38: // up
			case 90: // z
			case 32: // space
				moveForward = true;
				break;

		}

	};

	var onKeyUp = function(event) {

		switch (event.keyCode) {

			case 38: // up
			case 90: // z
			case 32: // space
				moveForward = false;
				break;

		}

	};

	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

	this.enabled = false;

	this.getObject = function() {

		return _this.yawObject;

	};

	this.isOnObject = function(boolean) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.update = function(delta) {

		if (_this.enabled === false) return;

		delta *= 0.1;

		this.velocity.z += (-this.velocity.z) * 0.08 * delta;

		this.velocity.y -= 0.5 * delta;

		if (moveForward) {
			this.velocity.z -= this.speed * delta;
		}

		if (isOnObject === true) {

			this.velocity.x = 0;
			this.velocity.z = 0;

		}

		_this.yawObject.translateX(this.velocity.x);
		_this.yawObject.translateY(this.velocity.y);
		_this.yawObject.translateZ(this.velocity.z);

		if (_this.yawObject.position.y !== 0.5) {

			this.velocity.y = 0;
			_this.yawObject.position.y = 0.5;

			canJump = true;

		}

	};

};
