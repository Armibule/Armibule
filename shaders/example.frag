precision mediump float;

varying vec2 pos;

const int BALL_COUNT = 30;
const float DIVIDER = 1000.0 / 30.0;
uniform vec3 balls[int(BALL_COUNT)];
//uniform vec2 hand;

uniform float yRatio;

/*
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5*(a-b)/k, 0.0, 1.0);
    return mix(a, b, h) - k*h*(1.0-h);
}


float smax(float a, float b, float k) {
    k = -k;
    float h = clamp(0.5 + 0.5*(a-b)/k, 0.0, 1.0);
    return mix(a, b, h) - k*h*(1.0-h);
}
*/

// balls[i].y/ yRatio + pos.y - pos.y/ yRatio

void main() {
  
  vec4 color = vec4(0.0, 0.4, 0.8, 1.0);
  vec4 color2 = vec4(1.0, 0.2, 0.0, 1.0);
    
  float density = 0.0;

  // optimized (balls[i].y + pos.y * (yRatio - 1.0)) / yRatio
  float ratioAddition = pos.y * (yRatio - 1.0);
  
  for (int i = 0 ; i < BALL_COUNT ; i += 1) {
    // balls[i].z -> radius
    
    density += (balls[i].z * DIVIDER) / length(vec2(balls[i].x, (balls[i].y + ratioAddition) / yRatio) - pos);
    
    /*density = max(density, 1.0 /step(balls[i].z, length(balls[i].xy - pos)));*/
  }
  
  
  /*
  float handDistance = smax(0.8, smin(1.0, 5.0 * length(vec2(hand.x, (hand.y + pos.y) / 2.0) - pos), 1.0), 1.0);
  density *= handDistance;
  */

  
  color *= step(80.0, density) * 0.5 + step(90.0, density) * 0.5 + 5.0 / density;
  
  color2 *= step(95.0, density) * 0.5 + step(100.0, density) * 0.5;
  
  gl_FragColor = color2 + color;

  //gl_FragColor.xy = pos.xy;
}