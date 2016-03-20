precision highp float;

#pragma glslify: pnoise = require(glsl-noise/periodic/3d);

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float time;
uniform vec3 color;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

varying vec2 vUv;

float turbulence( vec3 p ) {
    float w = 10.0;
    float t = -.5;
    for (float f = 1.0 ; f <= 10.0 ; f++ ){
        float power = pow( 2.0, f );
        t += abs( pnoise( vec3( power * p ), vec3( 5.0, 5.0, 5.0 ) ) / power );
    }
    return t;
}

void main() {

    vUv = uv;

    // get a turbulent 3d noise using the normal, normal to high freq
    float noise = 0.03 * turbulence(normal + time);

    // get a 3d noise using the position, low frequency
    float b = 0.01 * pnoise( position + vec3( 1.0 * time ), vec3( 100.0 ) );
    // compose both noises
    float displacement = noise + b;

    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

}
