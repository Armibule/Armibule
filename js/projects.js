/* SHADER */

let exampleShader;
const BOID_COUNT = 50;
const boids = [];
const NIGHBORS = 5;

const MOUSE_REPELL_DIST = 0.25   ** 2;
const MOUSE_REPELL_FORCE = 0.35;

const MOUSE_ATTRACT_DIST = 0.4   ** 2;
const MOUSE_ATTRACT_FORCE = 0.3;

const REPELL_DIST = 0.05   ** 2;
const REPELL_FORCE = 0.1;

const ALIGN_DIST = 0.2   ** 2;
const ALIGN_FORCE = 0.02;

const GATHER_DIST = 5   ** 2;
const GATHER_FORCE = 0.01;

const MIN_SPEED = 0.002;
const MAX_SPEED = 0.018;
const MAX_ANGLE_SPEED = 0.8;

const DRAW_SCALE = 0.012;


function mod(n, m) {
  return ((n % m) + m) % m;
}

class Boid {
    constructor(x, y, angle, speed) {
      this.x = x;
      this.y = y;

      this.angle = angle;
      this.angleSpeed = 0;

      this.speed = speed;

      // [[boid, distanceSquared], ...]
      this.nighbors = [];
    }

    register(other) {
      let distX = this.x-other.x;
      let distY = this.y-other.y;

      let distanceSquared = distX*distX + distY*distY;

      this.nighbors.push([other, distanceSquared]);
      other.nighbors.push([this, distanceSquared]);
    }

    applyForces(other, distanceSquared, strenght) {       
        /*// let distance = Math.sqrt(distanceSquared);


        // same direction
        //this.angle += (other.angle - this.angle) / distanceSquared / 10000;
        //other.angle += (this.angle - other.angle) / distanceSquared / 10000;
        
        
        // repell
        if (distance < 1 || true) {
            
        }*/

        var relativeToward = mod(Math.atan2(this.x - other.x, this.y - other.y) + PI - this.angle, TWO_PI);

        // TODO : Fix angle interpolation
        // align
        if (distanceSquared < REPELL_DIST) {
          if (relativeToward > 0 && relativeToward < PI) {
            this.angleSpeed += ((relativeToward - PI) % TWO_PI) * REPELL_FORCE * strenght;
          } else {
            this.angleSpeed += ((relativeToward + PI) % TWO_PI) * REPELL_FORCE * strenght;
          }

          if (relativeToward > -PI/2 && relativeToward < PI/2) {
            this.speed -= 0.002 * REPELL_FORCE * strenght;
          } else {
            this.speed += 0.002 * REPELL_FORCE * strenght;
          }
        } else if (distanceSquared < ALIGN_DIST) {
          this.angle += (other.angle - this.angle) * ALIGN_FORCE * strenght;
          
          this.speed += (other.speed - this.speed) * ALIGN_FORCE * strenght;
        } else if (distanceSquared < GATHER_DIST) {
          
          this.angleSpeed += relativeToward * GATHER_FORCE * strenght;

          if (relativeToward > -PI/2 && relativeToward < PI/2) {
            this.speed += 0.002 * GATHER_FORCE * strenght;
          } else {
            this.speed -= 0.002 * GATHER_FORCE * strenght;
          }
        
        }
    }

    update(mx, my, hovered) {
        if (this.speed < MIN_SPEED) {
          this.speed = MIN_SPEED;
        } else if (this.speed > MAX_SPEED) {
          this.speed = MAX_SPEED;
        }
        if (Math.abs(this.angleSpeed) > MAX_ANGLE_SPEED) {
          this.angleSpeed = this.angleSpeed/Math.abs(this.angleSpeed) * MAX_ANGLE_SPEED;
        }

        

        let vx = Math.sin(this.angle) * this.speed;
        let vy = Math.cos(this.angle) * this.speed;

        if (hovered) {
          this.angle = mod((this.angleSpeed/10 + this.angle), TWO_PI)
          this.x += vx;
          this.y += vy;

          // even speed
          this.speed += (0.003 - this.speed) / 150;
          this.angleSpeed *= 0.5;
        } else {
          this.angle = mod((this.angleSpeed/15 + this.angle), TWO_PI)
          this.x += vx / 1.5;
          this.y += vy / 1.5;

          // even speed
          this.speed += (0.003 - this.speed) / 100;
          this.angleSpeed *= 0.4;
        }
        
        
        this.nighbors.sort((a, b) => {
          return a[1] - b[1];
        })

        for (var i = 0 ; i < NIGHBORS ; i++) {
          this.applyForces(this.nighbors[i][0], this.nighbors[i][1],  1 - i/NIGHBORS);
        }

        // Escape from mouse
        let distX = this.x-mx;
        let distY = this.y-my;
        var relativeToward = mod(Math.atan2(distX, distY) + PI - this.angle, TWO_PI);
        let distanceSquared = distX*distX + distY*distY;
        
        if (hovered) {

          if (!mouseDown) {

            if (distanceSquared < MOUSE_REPELL_DIST) {
              if (relativeToward > 0 && relativeToward < PI) {
                this.angleSpeed += ((relativeToward - PI) % TWO_PI) * MOUSE_REPELL_FORCE;
              } else {
                this.angleSpeed += ((relativeToward + PI) % TWO_PI) * MOUSE_REPELL_FORCE;
              }

              if (relativeToward > -PI/2 && relativeToward < PI/2) {
                this.speed -= 0.002 * MOUSE_REPELL_FORCE;
              } else {
                this.speed += 0.002 * MOUSE_REPELL_FORCE;
              }
            }

          } else {

            if (distanceSquared < MOUSE_ATTRACT_DIST) {
              this.angleSpeed += relativeToward * MOUSE_ATTRACT_FORCE;

              if (relativeToward > -PI/2 && relativeToward < PI/2) {
                this.speed += 0.002 * MOUSE_ATTRACT_FORCE;
              } else {
                this.speed -= 0.002 * MOUSE_ATTRACT_FORCE;
              }
            }
          }
        }

        // ??? TODO : projection of the new speed and angle perpendiculary to the border
        if (this.x >= 1.0) {
            //this.x = 0.99
            this.x = -0.99
        } else if (this.x <= -1) {
            //this.x = -0.99
            this.x = 0.99
        }
        if (this.y >= xRatio) {
            //this.y = 0.99
            this.y = -xRatio + 0.01
        } else if (this.y <= -xRatio) {
            //this.y = -0.99
            this.y = xRatio - 0.01
        }
        this.nighbors = [];
    }
}


function preload() {
  // exampleShader = loadShader("shaders/projects.vert", "shaders/projects.frag");
}


const parent = "projectsHero";
var Cheight = document.getElementById(parent).getClientRects()[0].height;
var Cwidth = document.body.getClientRects()[0].width;
var yRatio = Cwidth / Cheight;
var xRatio = 1/yRatio;

function setup() {
  const canvas = createCanvas(Cwidth, Cheight, WEBGL);
  canvas.canvas.id = "heroCanvas";
  canvas.parent(parent);

  // shader(exampleShader);

  onResize();

  window.addEventListener('resize', onResize, true);

  noStroke();

  for (var i = 0 ; i < BOID_COUNT ; i++) {
    boids.push(new Boid(Math.random() -0.5, Math.random() -0.5, Math.random() * TWO_PI, Math.random() / 100))
  }
}

function onResize() {
  Cheight = document.getElementById(parent).getClientRects()[0].height;
  Cwidth = document.body.getClientRects()[0].width;

  if (Cwidth > 2000) {
    Cheight *= 2000 / Cwidth;
    Cwidth = 2000;
  }
  
  
  // Cheight = Cwidth //
  
  
  resizeCanvas(Cwidth, Cheight);

  yRatio = Cwidth / Cheight;
  xRatio = 1/yRatio;
  // exampleShader.setUniform("yRatio", yRatio);
}

/*
function prepareBoidsSpeeds() {
  speeds = [];
  for (var i = 0 ; i < BOID_COUNT ; i++) {
    speeds.push(boids[i].speed * 100);
  }
  return speeds;
}*/

function draw() {

  console.log(getFrameRate())

  if (!isVisible(canvas)) {
    return;
  }

  let mx = min(1, max(0, (mouseX / width))) * 2 - 1;
  let my = min(xRatio, max(-xRatio, (mouseY / height) * xRatio)) * 2 - xRatio;
  let hovered = isHovered(canvas);

  for (i = 0; i < boids.length; i++) {
    boid = boids[i]
    
    for (j = 0; j < i; j++) {
      if (i != j) {
        boid.register(boids[j]);
      }
    }
  }

  //beginShape(TRIANGLES);

  //exampleShader.setUniform('boidSpeeds', prepareBoidsSpeeds())

  clear();
  
  beginShape(TRIANGLES);

  var color1;
  var color2;

  boids.forEach((boid) => {
    
    boid.update(mx, my, hovered);

    Math.sin(this.angle);
    Math.cos(this.angle);

    color1 = boid.speed / MAX_SPEED * 255;
    color2 = Math.abs(boid.angleSpeed) / MAX_ANGLE_SPEED * 255;

    fill(color1, 255-color1, color2);
    stroke(color2,color2,color2);

    // exampleShader.setUniform("boidSpeed", boid.speed * 100);

    vertex((boid.x + Math.sin(boid.angle) * DRAW_SCALE * 2)          * width/2,
           (boid.y + Math.cos(boid.angle) * DRAW_SCALE * 2) * yRatio * height/2);
    
    vertex((boid.x + Math.sin( boid.angle + TWO_PI/3 ) * DRAW_SCALE)          * width/2,
           (boid.y + Math.cos( boid.angle + TWO_PI/3 ) * DRAW_SCALE) * yRatio * height/2);
    
    vertex((boid.x + Math.sin( boid.angle + TWO_PI/1.5 ) * DRAW_SCALE)          * width/2,
           (boid.y + Math.cos( boid.angle + TWO_PI/1.5 ) * DRAW_SCALE) * yRatio * height/2);

        })

  endShape();
}