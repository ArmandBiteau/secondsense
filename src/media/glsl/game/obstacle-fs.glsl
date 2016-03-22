#define FOG_DENSITY 0.43
#pragma glslify: fog_exp2 = require(glsl-fog/exp2)
#define POLES 4

#define REFLECTIONS 10.0

uniform float time;
uniform vec2 resolution;
uniform int type;
varying vec2 vUv;

vec3 iResolution = vec3(1000,1000,0);

float ripple(float dist, float shift)
{
	return cos(64.0 * dist + shift) / (1.0 + 1.0 * dist);
}

void main()
{

	float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
	float fogAmount = fog_exp2(fogDistance, FOG_DENSITY);

	vec4 fogColor = vec4(24.0/255.0, 29.0/255.0, 36.0/255.0, 0.0);

	if (type == 1){

		vec2 position = -1.0 + 2.0 * vUv;

		vec4 vertexColor = vec4(1.0,1.0,1.0,1.0);

		gl_FragColor = mix(vertexColor, fogColor, fogAmount);

	}

	if (type == 2){

		float larger = max(iResolution.x, iResolution.y);
		vec2 uv = vUv;
		vec2 uvflip = vec2(uv.x, -uv.y);
		vec2 cursor = (vec2(0,0) - 0.5*iResolution.xy) / larger;
		vec2 blessr = vec2(-cursor.x, cursor.y);
		float lum = 0.5 + 0.1 * ripple(length(uv), 0.0) + 0.0;
		float twopi = 2.0*3.141592654;
		const int count = POLES;
		float fcount = float(count);
		vec2 rot = vec2(cos(twopi*0.618), sin(twopi*0.618));
		vec2 tor = vec2(-sin(twopi*0.618), cos(twopi*0.618));

		for (int i = 0; i < count; ++i)
		{
			lum += 0.2 * ripple(length(cursor - uv), -time);
			cursor = cursor.x*rot + cursor.y*tor;
		}

		lum = 3.0*lum*lum - 2.0*lum*lum*lum;
		vec4 vertexColor = vec4(lum, lum, lum, 1.0);

		gl_FragColor = mix(vertexColor, fogColor, fogAmount);

	}
}
