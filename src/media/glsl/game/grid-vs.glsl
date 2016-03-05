precision highp float;
precision highp int;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;

varying vec2 vUv;

vec4 Caustic_Procedural1455831747154_5_main()
{
    vec4 Caustic_Procedural1455831747154_5_gl_Position = vec4(0.0);
    vUv = uv;
    Caustic_Procedural1455831747154_5_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    return Caustic_Procedural1455831747154_5_gl_Position *= 1.0;
}

void main()
{
    gl_Position = Caustic_Procedural1455831747154_5_main();
}
