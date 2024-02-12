const welcomeElement = document.getElementById("welcome");

const characters = "azertyuiopqsdfghjklmwxcvbn0123456789";
const welcomeText = welcomeElement.textContent;


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve("done!"), ms)
      });
}

async function glitch() {
    while (true) {
        var content = welcomeText;

        for (var index = 0 ; index < welcomeText.length ; index++) {

            for (var i = 0 ; i < 10 ; i++) {
                letter = characters[randint(0, characters.length - 1)];
            
                content = content.slice(0, index) + letter + content.slice(index + 1);
                welcomeElement.textContent = content;

                await sleep(randint(5, 10));
            }

            await sleep(randint(50, 80));
        }

        sleep(randint(1000, 1500))

        for (var index = 0 ; index < welcomeText.length ; index++) {
            letter = welcomeText[index];
            
            content = content.slice(0, index) + letter + content.slice(index + 1);
            welcomeElement.textContent = content;
            
            await sleep(randint(50, 80));
        }

        await sleep(randint(6000, 10000));
    }
}

glitch()




/* SHADER */

class Ball {  
  constructor(x, y, radius = 0.1, vx = 0, vy = 0) {
    this.x = x;
    this.y = y;
    
    this.radius = radius;
        
    this.vx = vx;
    this.vy = vy;
  }
  
  update(gravityX, gravityY) {
    this.vx += gravityX;
    this.vy += gravityY;
    
    this.vx *= 0.98;
    this.vy *= 0.98;
    
    this.x += this.vx;
    this.y += this.vy;
    
    if (this.x < 0) {
      this.vx *= -0.96;
      this.x = 0;
    }
    if (this.y < 0) {
      this.vy *= -0.96;
      this.y = 0;
    }
    if (1 < this.x) {
      this.vx *= -0.96;
      this.x = 1;
    }
    if (1 < this.y) {
      this.vy *= -0.96;
      this.y = 1;
    }
  }
  
  resolve(ball) {    
    let distX = this.x - ball.x;
    let distY = this.y - ball.y;
    
    let dist = Math.sqrt(distX*distX + distY*distY);
    let diff = dist - (this.radius + ball.radius);
    
    if (diff < 0) {
      let xOffset = distX * (diff / dist);
      let yOffset = distY * (diff / dist);
      
      this.x -= xOffset/2;
      ball.x += xOffset/2;
      
      this.y -= yOffset/2;
      ball.y += yOffset/2;
    }
  }
}

let exampleShader;
let balls = [];

const BALLS_COUNT = 30;

for (i = 0 ; i < BALLS_COUNT ; i++) {
  balls.push(new Ball(Math.random() * 0.5, Math.random() * 0.5, 0.05 + BALLS_COUNT * Math.random() / 10000, Math.random() / 50, Math.random() / 50))
}
for (i = 0 ; i < balls.length ; i++) {
  ball = balls[i]
  for (j = 0 ; j < i ; j++) {
    if (i != j) {
      ball.resolve(balls[j])
    }
  }
}

// let gravityX = 0.001;
// let gravityY = -0.001;


function preload() {
  exampleShader = loadShader("shaders/example.vert", "shaders/example.frag");
}

function ballsToArray() {
  r = []
  
  for (i = 0 ; i < balls.length ; i++) {
    r.push(balls[i].x);
    r.push(balls[i].y);
    r.push(balls[i].radius);
  }
  
  return r;
}

const parent = "indexHero";
var parentRect = document.getElementById(parent).getClientRects()[0];

function setup() {
  const canvas = createCanvas(parentRect.width, parentRect.height, WEBGL);
  canvas.canvas.id = "heroCanvas";
  canvas.parent(parent);

  shader(exampleShader);
  
  onResize()

  window.addEventListener('resize', onResize, true);
  
  /*for (i = 0 ; i < balls.length ; i++) {
    balls[i].update(gravityX * 30, gravityY * 30);
  }*/
  
  noStroke();
}

function onResize() {
  parentRect = document.getElementById(parent).getClientRects()[0];
  resizeCanvas(parentRect.width, parentRect.height);
  exampleShader.setUniform("yRatio", 2.0 * parentRect.width/parentRect.height);

  console.log("resize");
}


function draw() {
  let mx = min(1, max(0, ((mouseX - parentRect.x) / width))) * 1.1;
  let my = min(1, max(0, ((mouseY - parentRect.y) / height))) * 1.1;
 
  if (mouseDown) {
    for (i = 0 ; i < balls.length ; i++) {
      ball = balls[i]
      ball.update((mx-ball.x) / 4000, -((my-ball.y)) / 8000)
    }
  } else {
    for (i = 0 ; i < balls.length ; i++) {
      ball = balls[i]
      ball.update((ball.x-mx) / 8000, -((ball.y-my)) / 16000)
    }
  }
  

  /*
  for (i = 0 ; i < balls.length ; i++) {
    balls[i].update(mx / 1000, -my / 1000)
  }*/
  
  for (i = 0 ; i < balls.length ; i++) {
    ball = balls[i]
    for (j = 0 ; j < i ; j++) {
      if (i != j) {
        ball.resolve(balls[j])
      }
    }
  }
  
  exampleShader.setUniform("balls", ballsToArray());
  
  clear();
  
  rect(0, 0, width, height);
}