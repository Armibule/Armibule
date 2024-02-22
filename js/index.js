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

    for (var index = 0; index < welcomeText.length; index++) {

      for (var i = 0; i < 10; i++) {
        letter = characters[randint(0, characters.length - 1)];

        content = content.slice(0, index) + letter + content.slice(index + 1);
        welcomeElement.textContent = content;

        await sleep(randint(5, 10));
      }

      await sleep(randint(50, 80));
    }

    sleep(randint(1000, 1500))

    for (var index = 0; index < welcomeText.length; index++) {
      letter = welcomeText[index];

      content = content.slice(0, index) + letter + content.slice(index + 1);
      welcomeElement.textContent = content;

      await sleep(randint(50, 80));
    }

    await sleep(randint(6000, 10000));
  }
}

glitch();




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
      this.x = 0.01;
    }
    if (this.y < 0) {
      this.vy *= -0.96;
      this.y = 0.01;
    }
    if (1 < this.x) {
      this.vx *= -0.96;
      this.x = 0.99;
    }
    if (1 < this.y) {
      this.vy *= -0.96;
      this.y = 0.99;
    }
  }

  resolve(ball) {
    let distX = this.x - ball.x;
    let distY = this.y - ball.y;

    if (Math.abs(distX) + Math.abs(distY) < 0.01) {
      distX = 0.01
    }

    let dist = Math.sqrt(distX * distX + distY * distY);
    let diff = dist - (this.radius + ball.radius);

    if (diff < 0) {
      let xOffset = distX * (diff / dist) / 2;
      let yOffset = distY * (diff / dist) / 2;

      this.x -= xOffset;
      ball.x += xOffset;
      this.vx -= xOffset / 2;
      ball.vx += xOffset / 2;

      this.y -= yOffset;
      ball.y += yOffset;
      this.vy -= yOffset / 2;
      ball.vy += yOffset / 2;
    }
  }
}

let exampleShader;
let balls = [];

const BALLS_COUNT = 30;

for (i = 0; i < BALLS_COUNT; i++) {
  balls.push(new Ball(Math.random() * 0.5, Math.random() * 0.5, 0.02 + BALLS_COUNT * Math.random() / 2000, Math.random() / 50, Math.random() / 50))
}
for (i = 0; i < balls.length; i++) {
  ball = balls[i]
  for (j = 0; j < i; j++) {
    if (i != j) {
      ball.resolve(balls[j])
    }
  }
}

// let gravityX = 0.001;
// let gravityY = -0.001;


function preload() {
  exampleShader = loadShader("shaders/index.vert", "shaders/index.frag");
}

function ballsToArray() {
  r = []

  for (i = 0; i < balls.length; i++) {
    r.push(balls[i].x);
    r.push(balls[i].y);
    r.push(balls[i].radius);
  }

  return r;
}

const parent = "indexHero";
var Cheight = document.getElementById(parent).getClientRects()[0].height;
var Cwidth = document.body.getClientRects()[0].width;

function setup() {
  const canvas = createCanvas(Cwidth, Cheight, WEBGL);
  canvas.canvas.id = "heroCanvas";
  canvas.parent(parent);

  shader(exampleShader);

  onResize();

  window.addEventListener('resize', onResize, true);

  /*for (i = 0 ; i < balls.length ; i++) {
    balls[i].update(gravityX * 30, gravityY * 30);
  }*/

  noStroke();
}

function onResize() {
  Cheight = document.getElementById(parent).getClientRects()[0].height;
  Cwidth = document.body.getClientRects()[0].width;

  if (Cwidth > 2000) {
    Cheight *= 2000 / Cwidth;
    Cwidth = 2000;
  }

  resizeCanvas(Cwidth, Cheight);

  exampleShader.setUniform("yRatio", Cwidth / Cheight);
  // console.log("resize");
}


function draw() {

  if (!isVisible(canvas)) {
    return;
  }

  let mx = min(1, max(0, (mouseX / width)));
  let my = 1 - min(1, max(0, (mouseY / height)));

  let gx;
  let gy;
  let scale;
  let ball;

  if (mouseDown) {
    for (i = 0; i < balls.length; i++) {
      ball = balls[i]
      gx = (mx - ball.x) / 8000;
      gy = (my - ball.y) / 16000;

      ball.update(gx, gy);
    }
  } else {
    for (i = 0; i < balls.length; i++) {
      ball = balls[i];
      gx = ball.x - mx;
      gy = ball.y - my;

      scale = 0.00005 / (gx * gx + gy * gy)

      ball.update(Math.min(gx * scale, 0.1), Math.min(gy * scale, 0.1));
    }
  }


  /*
  for (i = 0 ; i < balls.length ; i++) {
    balls[i].update(mx / 1000, -my / 1000)
  }*/

  for (i = 0; i < balls.length; i++) {
    ball = balls[i]
    for (j = 0; j < i; j++) {
      if (i != j) {
        ball.resolve(balls[j])
      }
    }
  }

  exampleShader.setUniform("balls", ballsToArray());

  // exampleShader.setUniform("hand", [mx, my]);

  clear();

  rect(0, 0, width, height);
}