precision mediump float;

varying vec2 pos;
/*
//uniform float yRatio;

const float chipLeft = 0.25;
const float chipRight = 0.75;
const float chipTop = 0.25;
const float chipBottom = 0.75;


void main() {
  float y = pos.y * 0.5;

  vec4 background = vec4(0.1, 0.1, 0.1, 1.0);
  vec4 chipColor = vec4(0.5, 0.5, 0.6, 1.0);
  vec4 wireColor = vec4(0.4, 0.3, 0.4, 1.0);

  float isChip = step(chipLeft, pos.x) * (1.0 - step(chipRight, pos.x)) * step(chipTop, y) * (1.0 - step(chipBottom, y));
  
  float isVerticalWire = step(abs(pos.x - 0.5), abs(y - 0.5));

  float isWire = step(0.8, fract(pos.x * 10.0)) * isVerticalWire + step(0.8, fract(y * 10.0)) * (1.0 - isVerticalWire);

  gl_FragColor = background * max(1.0 - isChip - isWire, 0.0) + wireColor * max(isWire - isChip, 0.0) + chipColor * isChip;
}*/