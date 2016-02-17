precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 offset;
attribute vec3 transform;

attribute float instanceID;
attribute vec2 uv;

varying vec2 vUv;
varying float vInstanceID;

void main() {

	vUv = uv;

	vec3 vPosition = vec3( position.x, position.y, (position.z * transform.z) * pow(offset.x/25.0, 2.0) );

	vec3 newPosition = vec3(vPosition.x + offset.x, vPosition.y + offset.y, vPosition.z);

	vInstanceID = instanceID;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

}
