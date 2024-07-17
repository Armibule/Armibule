/* SHADER */

let exampleShader;


function preload() {
  // exampleShader = loadShader("shaders/skills.vert", "shaders/skills.frag");
}


class Dot {
  constructor(x, y, vx, vy, id) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;

    this.dotsDistances = []; // [[dot, distance], ...]
    
    this.id = id;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    this.x = mod(this.x, Cwidth);
    this.y = mod(this.y, Cheight);

    this.dotsDistances = [];
  }

  register(dot) {
    let distance = Math.sqrt((dot.x-this.x)**2 + (dot.y-this.y)**2);

    this.dotsDistances.push([dot, distance]);
    dot.dotsDistances.push([this, distance]);
  }

  sortNeighbors() {
    this.dotsDistances.sort((a, b) => {
      return a[1] - b[1];
    });
  }
}


const parent = "skillsHero";
var Cheight = document.getElementById(parent).getClientRects()[0].height;
var Cwidth = document.body.getClientRects()[0].width;
var yRatio = Cwidth / Cheight;
var xRatio = 1 / yRatio;

var dots = [];

function setup() {
  const canvas = createCanvas(Cwidth, Cheight, WEBGL);
  canvas.canvas.id = "heroCanvas";
  canvas.parent(parent);

  // shader(exampleShader);

  onResize();

  window.addEventListener('resize', onResize, true);

  noStroke();

  for (i=0 ; i<50 ; i++) {
    dots.push(new Dot(Cwidth*Math.random(), Cheight*Math.random(), (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, i));
  }
}

function onResize() {
  Cheight = document.getElementById(parent).getClientRects()[0].height;
  Cwidth = document.body.getClientRects()[0].width;

  if (Cwidth > 2000) {
    Cheight *= 2000 / Cwidth;
    Cwidth = 2000;
  }

  resizeCanvas(Cwidth, Cheight);

  yRatio = Cwidth / Cheight;
  xRatio = 1 / yRatio;
}

function draw() {

  if (!isVisible(canvas)) {
    return;
  }

  for (i = 0; i < dots.length; i++) {
    dot = dots[i]

    for (j = 0; j < i; j++) {
      if (i != j) {
        dot.register(dots[j]);
      }
    }
  }


  noStroke();
  fill(0, 0, 0, 40);
  rect(Cwidth/-2,Cheight/-2, Cwidth, Cheight);

  noStroke();
  fill(255, 255, 255, 100);
  beginShape(TRIANGLES);

  dots.forEach((dot) => {
    dot.sortNeighbors();

    let dot2 = dot.dotsDistances[0][0];
    let dot3 = dot.dotsDistances[1][0];

    dist3 = Math.sqrt((dot2.x-dot3.x)**2 + (dot2.y-dot3.y)**2);

    let distanceSum = dot.dotsDistances[0][1] + dot.dotsDistances[1][1] + dist3;
    
    if (distanceSum < 50000 && dot.dotsDistances[0][1] < 100 && dot.dotsDistances[1][1] < 100 && dist3 < 100) {
      fill(distanceSum * 5 + 100, distanceSum * 3 + 100, 255, 8000 / distanceSum);

      vertex(dot.x - Cwidth/2, dot.y - Cheight/2);
      vertex(dot.dotsDistances[0][0].x - Cwidth/2, dot.dotsDistances[0][0].y - Cheight/2);
      vertex(dot.dotsDistances[1][0].x - Cwidth/2, dot.dotsDistances[1][0].y - Cheight/2);
    }
  });

  endShape();


  strokeWeight(4);
  stroke(255, 255, 255, 255);
  noFill();
  beginShape(LINES);

  linesDrawn = new Set();

  dots.forEach((dot) => {
    for (i=0 ; i < 3 ; i++) {
      let distance = dot.dotsDistances[i][1];

      if (distance < 200) {
        let otherDot = dot.dotsDistances[i][0];

        if (linesDrawn.has(`${otherDot.id},${dot.id}`)) {
          return;
        } else {
          linesDrawn.add(`${dot.id},${otherDot.id}`);

          stroke(distance*5 + 120, distance*3 + 120, 255, 8000/distance);
          vertex(dot.x - Cwidth/2, dot.y - Cheight/2);
          vertex(otherDot.x - Cwidth/2, otherDot.y - Cheight/2);
        }
      } else {
        return;
      }
    }
  });

  endShape();


  strokeWeight(5);
  stroke(255, 255, 255);
  beginShape(POINTS);

  dots.forEach((dot) => {
    vertex(dot.x - Cwidth/2, dot.y - Cheight/2);
  })

  endShape();

  /*beginShape(TRIANGLES);

  for (x = 100 ; x < Cwidth ; x += 50) {
    for (y = 100 ; y < Cheight ; y += 50) {
      let validDots = []  // [[dot, distance], ...]

      dots.forEach((dot) => {
        validDots.push([dot, (dot.x-x)**2 + (dot.y-y)**2]);
      });

      validDots.sort((a, b) => {
        return a[1] - b[1];
      });
      
      fill(validDots[0][1]/100, validDots[1][1]/100, validDots[2][1]/100);
      
      vertex((validDots[0][0].x - Cwidth/2) * 2, (validDots[0][0].y - Cheight/2) * 2);
      vertex((validDots[1][0].x - Cwidth/2) * 2, (validDots[1][0].y - Cheight/2) * 2);
      vertex((validDots[2][0].x - Cwidth/2) * 2, (validDots[2][0].y - Cheight/2) * 2);

      
      
      fill(255, 0, 0);
      
      vertex((x-5 - Cwidth/2) * 2, (y - Cheight/2) * 2);
      vertex((x+5 - Cwidth/2) * 2, (y - Cheight/2) * 2);
      vertex((x - Cwidth/2) * 2, (y+10 - Cheight/2) * 2);
    }
  } 

  endShape();*/

  dots.forEach((dot) => {
    dot.move();
  });
}