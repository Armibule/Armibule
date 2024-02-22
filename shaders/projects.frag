precision mediump float;

varying vec2 pos;

uniform float boidSpeed;

void main() {
  gl_FragColor = vec4(boidSpeed, 1.0 - boidSpeed, 1.0 - boidSpeed, 1.0);
}