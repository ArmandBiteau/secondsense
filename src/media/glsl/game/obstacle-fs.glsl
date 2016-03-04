#define FOG_DENSITY 0.8

precision highp float;

#pragma glslify: fog_exp2 = require(glsl-fog/exp2)

void main() {

	float fogDistance = (gl_FragCoord.z/gl_FragCoord.w);
	float fogAmount = fog_exp2(fogDistance, FOG_DENSITY);

	vec4 fogColor = vec4(24.0/255.0, 29.0/255.0, 36.0/255.0, 0.0);

    vec4 vertexColor = vec4(1.0,1.0,1.0,1.0);

    gl_FragColor = mix(vertexColor, fogColor, fogAmount);

}
