#define FOG_DENSITY 0.00023

precision highp float;
precision highp int;

uniform float time;
uniform float speed;
uniform float resolution;
uniform vec3 color;
uniform float ghostify;
uniform float brightness;

varying vec2 vUv;

float mod289(float x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 perm(vec4 x)
{
    return mod289(((x * 34.0) + 1.0) * x);
}
float noise3d(vec3 p)
{
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);
    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);
    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);
    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));
    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
    return o4.y * d.y + o4.x * (1.0 - d.y);
}
vec4 Caustic_Procedural()
{
    vec4 Caustic_Procedural_gl_FragColor = vec4(24.0/255.0, 29.0/255.0, 36.0/255.0, 0.0);
    vec2 uv = 2.0 * vUv.xy / resolution - 1.0;
    vec3 water[4];
    mat3 r = mat3(0.36, 0.48, -0.8, -0.8, 0.60, 0.0, 0.48, 0.64, 0.60);
    vec3 p_pos = r * vec3(uv * vec2(16.0, 9.0), 0.0);
    vec3 p_time = r * vec3(0.0, 0.0, time * speed);
    water[0] = p_pos / 2.0 + p_time;
    water[1] = p_pos / 4.0 + p_time;
    water[2] = p_pos / 8.0 + p_time;
    water[3] = p_pos / 16.0 + p_time;
    vec3 points[4];
    points[0] = water[0];
    points[1] = water[1];
    points[2] = water[2];
    points[3] = water[3];
    vec4 n = vec4(noise3d(points[0]), noise3d(points[1]), noise3d(points[2]), noise3d(points[3]));
    float p = dot(abs(2.0 * n - 1.0), vec4(0.5 * ghostify, 0.25 * ghostify, 0.125 * ghostify, 0.2 * ghostify));
    float q = sqrt(p);
    Caustic_Procedural_gl_FragColor = vec4(color * (brightness + 1.0 - q), 1.0);
    return Caustic_Procedural_gl_FragColor *= 1.0;
}

#pragma glslify: fog_exp2 = require(glsl-fog/exp2)

void main()
{
    gl_FragColor = Caustic_Procedural();

    if (gl_FragColor.r < 0.4) discard;

	float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
	float fogAmount = fog_exp2(fogDistance, FOG_DENSITY);
	vec4 fogColor = vec4(24.0/255.0, 29.0/255.0, 36.0/255.0, 0.0);

    gl_FragColor = mix(gl_FragColor, fogColor, fogAmount);
}
