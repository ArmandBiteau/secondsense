#define FOG_DENSITY 0.0003

precision highp float;

varying vec2 vUv;
varying float vInstanceID;

#pragma glslify: fog_exp2 = require(glsl-fog/exp2)

void main() {

	vec2 uv = vUv;
	uv.x = (-uv.x/48.0+1.0/48.0) + mod(vInstanceID,48.0)/48.0;
	uv.y = uv.y/48.0 + floor(vInstanceID/48.0)/48.0;

	float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
	float fogAmount = fog_exp2(fogDistance, FOG_DENSITY);

	vec4 fogColor = vec4(24.0/255.0, 29.0/255.0, 36.0/255.0, 0.0);

    vec4 vertexColor = vec4(1.0,1.0,1.0,1.0);

    gl_FragColor = mix(vertexColor, fogColor, fogAmount);

}
