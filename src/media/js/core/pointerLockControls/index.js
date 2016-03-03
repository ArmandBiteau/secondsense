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
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var isOnObject = false;
	var canJump = false;

	var velocity = new THREE.Vector3();

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
				moveForward = true;
				break;

			// case 37: // left
			// case 81: // q
			// 	moveLeft = true; break;
			//
			// case 40: // down
			// case 83: // s
			// 	moveBackward = true;
			// 	break;
			//
			// case 39: // right
			// case 68: // d
			// 	moveRight = true;
			// 	break;
			//
			case 32: // space
				moveForward = true;
				// if (canJump === true) velocity.y += 1;
				// canJump = false;
				break;

		}

	};

	var onKeyUp = function(event) {

		switch (event.keyCode) {

			case 38: // up
			case 90: // z
				moveForward = false;
				break;

			// case 37: // left
			// case 81: // q
			// 	moveLeft = false;
			// 	break;
			//
			// case 40: // down
			// case 83: // a
			// 	moveBackward = false;
			// 	break;
			//
			// case 39: // right
			// case 68: // d
			// 	moveRight = false;
			// 	break;

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

		velocity.x += (-velocity.x) * 0.08 * delta;
		velocity.z += (-velocity.z) * 0.08 * delta;

		velocity.y -= 0.5 * delta;

		if (moveForward) velocity.z -= 0.0025 * delta;
		if (moveBackward) velocity.z += 0.0025 * delta;

		if (moveLeft) velocity.x -= 0.0025 * delta;
		if (moveRight) velocity.x += 0.0025 * delta;

		if (isOnObject === true) {

			velocity.x = 0;
			velocity.z = 0;

		}

		_this.yawObject.translateX(velocity.x);
		_this.yawObject.translateY(velocity.y);
		_this.yawObject.translateZ(velocity.z);

		if (_this.yawObject.position.y < 0.5) {

			velocity.y = 0;
			_this.yawObject.position.y = 0.5;

			canJump = true;

		}

	};

};
