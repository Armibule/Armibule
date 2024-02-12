precision mediump float;

varying vec2 pos;

const int BALL_COUNT = 30;
const float DIVIDER = 30.0;
uniform vec3 balls[int(BALL_COUNT)];

void main() {
  
  vec4 color = vec4(0.0, 0.4, 0.8, 1.0);
  vec4 color2 = vec4(1.0, 0.2, 0.0, 1.0);
    
  float density = 0.0;
  
  for (int i = 0 ; i < BALL_COUNT ; i += 1) {
    // balls[i].z -> radius
    
    density += (balls[i].z * 500.0 / DIVIDER) / length(balls[i].xy - pos);
    
    /*density = max(density, 1.0 /step(balls[i].z, length(balls[i].xy - pos)));*/
  }
  
  color *= step(80.0, density) * 0.5 + step(90.0, density) * 0.5 + 5.0 / density;
  
  color2 *= step(95.0, density) * 0.5 + step(100.0, density) * 0.5;
  
  gl_FragColor = color + color2;
}