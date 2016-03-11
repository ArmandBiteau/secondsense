#define FOG_DENSITY 0.0
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
		if (type == 1){
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

		if (type == 2){
			float larger = max(iResolution.x, iResolution.y);
			//vec2 uv = (gl_FragCoord.xy - .5*iResolution.xy) / larger;
			vec2 uv = vUv;
			vec2 uvflip = vec2(uv.x, -uv.y);
			vec2 cursor = (vec2(0,0) - .5*iResolution.xy) / larger;
			vec2 blessr = vec2(-cursor.x, cursor.y);

			//float on = float(abs(uv.x)<.25 && abs(uv.y)<.25);

			float lum = .5 +
				/*.1 * ripple(length(cursor - uv), -time) +
				.1 * ripple(length(blessr - uv), -time) +
				.1 * ripple(length(cursor - uvflip), -time) +
				.1 * ripple(length(blessr - uvflip), -time) +*/
				.1 * ripple(length(uv), 0.0) +
				//.1 * cos(64.0*uv.y - time) +
				//.1 * cos(64.0*(uv.x*uv.x) - time) +
				0.0;

			float twopi = 2.0*3.141592654;
			const int count = POLES;
			float fcount = float(count);
			vec2 rot = vec2(cos(twopi*.618), sin(twopi*.618));
			vec2 tor = vec2(-sin(twopi*.618), cos(twopi*.618));
			for (int i = 0; i < count; ++i)
			{
				lum += .2 * ripple(length(cursor - uv), -time);
				cursor = cursor.x*rot + cursor.y*tor;
			}

			/*float lum = .5, dist;
			vec2 part, flip = vec2(1.0, 1.0);

			//float freq = 64.0, phase = -time;
			float freq = 32.0, phase  = 0.0; // * pow(4.0, cos(time/8.0)), phase = 0.0;

			for (float ox = -REFLECTIONS; ox <= REFLECTIONS; ox += 1.0)
			{
				for (float oy = -REFLECTIONS; oy <= REFLECTIONS; oy += 1.0)
				{
					dist = length((cursor*flip-uv)+vec2(ox, oy));
					lum += cos(freq * dist - phase) / (5.0 + 10.0*dist);

					flip.y *= -1.0;
				}
				flip.x *= -1.0;
			}*/

			lum = 3.0*lum*lum - 2.0*lum*lum*lum;
			gl_FragColor = vec4(lum, lum, lum, 1.0);


			/*fragColor = vec4(.5+.5*sin(3000.0*time),
				.5+.5*sin(4997.0*time+iResolution.x*3910.0),
				.5+.5*cos(2872.0*time+iResolution.y*8721.0), 1.0);*/
		}
}
