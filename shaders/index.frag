precision mediump float;

varying vec2 pos;

const int BALL_COUNT = 30;
const float DIVIDER = 1000.0 / 30.0;
uniform vec3 balls[int(BALL_COUNT)];
//uniform vec2 hand;

uniform float yRatio;
uniform float time;   // 0-1 000 000

#define TWO_PI 6.28318530717

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

  float t = sin(time*TWO_PI / 5000.0);
  
  vec4 color = vec4(0.0, 0.4, 0.8, 1.0);
  vec4 color2 = vec4(1.0, 0.2, 0.0, 1.0);
  vec4 color3 = vec4(0.0, 0.0, 1.0, 1.0);
  vec4 shadow = vec4(0.0, 0.0, 0.0, 1.0);
    
  float density = 0.0;

  // optimized (balls[i].y + pos.y * (yRatio - 1.0)) / yRatio
  float ratioAddition = pos.y * (yRatio - 1.0);
  
  for (int i = 0 ; i < BALL_COUNT ; i += 1) {
    // balls[i].z -> radius
    
    density += (balls[i].z * DIVIDER) / length(vec2(balls[i].x, (balls[i].y + ratioAddition) / yRatio) - pos);
    
    /*density = max(density, 1.0 /step(balls[i].z, length(balls[i].xy - pos)));*/
  }

  density += t*3.0;
  // color3 *= (200.0 - clamp((50.0-density)*(50.0-density), 0.0, 200.0))/2000.0;
  color3 *= 10.0*(0.1 - clamp((90.0-density)*(90.0-density), 0.0, 0.1))
            + 10.0*(0.1 - clamp((95.0-density)*(95.0-density), 0.0, 0.1))
            + 10.0*(0.1 - clamp((100.0-density)*(100.0-density), 0.0, 0.1));
  /*color3 *= sin(density)*0.3 + 0.3;
  color3 *= step(density, 80.0);*/
  /*color3 *= step(fract(density * 0.5), 0.02) * 0.1;
  color3 *= step(density, 80.0);*/
  
  /*
  float handDistance = smax(0.8, smin(1.0, 5.0 * length(vec2(hand.x, (hand.y + pos.y) / 2.0) - pos), 1.0), 1.0);
  density *= handDistance;
  */

  color *= step(80.0, density) * 0.5 + step(90.0, density) * 0.5 + 5.0 / density;
  
  color2 *= step(95.0, density) * 0.5 + step(100.0, density) * 0.5;

  shadow += smoothstep(95.0, 100.0, density)*step(0.0, 100.0-density)*0.05;
  shadow += smoothstep(90.0, 95.0, density)*step(0.0, 95.0-density)*0.05;
  //shadow += smoothstep(80.0, 90.0, density)*step(0.0, 90.0-density)*0.015;
  
  gl_FragColor = color + color2 + color3 - shadow*t;
}