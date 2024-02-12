attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 pos;

uniform float yRatio;

void main() {
  pos = aTexCoord;
  
  vec4 position = vec4(aPosition, 1.0);
  //position.xy = position.xy * 2.0 - 1.0;

  position.x = position.x * 2.0 - 1.0;
  position.y = position.y * yRatio - 2.0;
  
  gl_Position = position;
}