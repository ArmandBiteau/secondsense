'use strict';

/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 */

module.exports = function(camera, onError) {

	var vrInputs = [];

    var _this = this;

    _this.pitchObject = new THREE.Object3D();
    _this.pitchObject.add(camera);

    _this.yawObject = new THREE.Object3D();
    _this.yawObject.position.y = 0.5;
    _this.yawObject.add(_this.pitchObject);

    var moveForward = false;

    var isOnObject = false;
    var canJump = false;

    var velocity = new THREE.Vector3();

    // var PI_2 = Math.PI / 2;

	function filterInvalidDevices(devices) {

		// Exclude Cardboard position sensor if Oculus exists.

		var oculusDevices = devices.filter(function(device) {

			return device.deviceName.toLowerCase().indexOf('oculus') !== -1;

		});

		if (oculusDevices.length >= 1) {

			return devices.filter(function(device) {

				return device.deviceName.toLowerCase().indexOf('cardboard') === -1;

			});

		} else {

			return devices;

		}

	}

	function gotVRDevices(devices) {

		devices = filterInvalidDevices(devices);

		for (var i = 0; i < devices.length; i++) {

			if (devices[i] instanceof PositionSensorVRDevice) {

				vrInputs.push(devices[i]);

			}

		}

		if (onError) onError('HMD not available');

	}

	if (navigator.getVRDevices) {

		navigator.getVRDevices().then(gotVRDevices);

	}

	function onDocumentTouchEnd(event) {

		event.preventDefault();

		moveForward = false;

	}

	function onDocumentTouchStart(event) {

		if (event.touches.length === 1) {

			event.preventDefault();

			moveForward = true;

			document.querySelector('canvas').addEventListener('touchend', onDocumentTouchEnd, false);

		}

	}

	function onDocumentTouchMove(event) {

		if (event.touches.length === 1) {

			event.preventDefault();

			moveForward = true;

		}

	}

	document.querySelector('canvas').addEventListener('touchstart', onDocumentTouchStart, false);
	document.querySelector('canvas').addEventListener('touchend', onDocumentTouchEnd, false);
	document.querySelector('canvas').addEventListener('touchmove', onDocumentTouchMove, false);

	this.scale = 1;

    this.getObject = function() {

		return _this.yawObject;

	};

	this.isOnObject = function(boolean) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.update = function(delta) {

		delta *= 0.1;
		velocity.x += (-velocity.x) * 0.08 * delta;
		velocity.z += (-velocity.z) * 0.08 * delta;

		velocity.y -= 0.5 * delta;

		if (moveForward) velocity.z -= 0.0025 * delta;

		if (isOnObject === true) {
			velocity.x = 0;
			velocity.z = 0;
		}

		for (var i = 0; i < vrInputs.length; i++) {

			var vrInput = vrInputs[i];

			var state = vrInput.getState();

			if (state.orientation !== null) {

				camera.quaternion.copy(state.orientation);

			}

			if (state.position !== null) {

				camera.position.copy(state.position).multiplyScalar(_this.scale);

			}

		}

		// camera.translateX(velocity.x);
		// camera.translateY(velocity.y);
		camera.translateZ(velocity.z);

		if (camera.position.y !== 0.5) {

			camera.position.y = 0.5;

		}

	};

	this.resetSensor = function() {

		for (var i = 0; i < vrInputs.length; i++) {

			var vrInput = vrInputs[i];

			if (vrInput.resetSensor !== undefined) {

				vrInput.resetSensor();

			} else if (vrInput.zeroSensor !== undefined) {

				vrInput.zeroSensor();

			}

		}

	};

	this.zeroSensor = function() {

		console.warn('THREE.VRControls: .zeroSensor() is now .resetSensor().');
		this.resetSensor();

	};

	this.dispose = function() {

		vrInputs = [];

	};

};
