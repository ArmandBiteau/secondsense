precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 color;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

void main() {

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
