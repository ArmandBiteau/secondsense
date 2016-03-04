#define FOG_DENSITY 0.0

uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

#pragma glslify: fog_exp2 = require(glsl-fog/exp2)

void main() {

    float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
    float fogAmount = fog_exp2(fogDistance, FOG_DENSITY);

    vec4 fogColor = vec4(0.0, 0.0, 0.0, 0.0);

    vec2 position = -1.0 + 2.0 * vUv;

    float red = abs( sin( position.x * position.y + time / 5.0 ) );
    float green = abs( sin( position.x * position.y + time / 4.0 ) );
    float blue = abs( sin( position.x * position.y + time / 3.0 ) );

    vec4 vertexColor = vec4(red,green,blue,1.0);

    gl_FragColor = mix(vertexColor, fogColor, fogAmount);

}
