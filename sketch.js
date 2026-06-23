let shotSound, hitSound, music;
let bulletX, bulletY;
let shooting = false;
let dirX, dirY;
let points = 0;
let lives = 3;
let exploding = false;
let explodeX, explodeY;
let explodeTimer = 0;
let boyImg, mugImg, barImg;
let gameState = "start";

let mug = {
  x: 0,
  y: 230,
  alive: false,
  timer: 0
};

function preload() {
  shotSound = loadSound('shot.mp3');
  hitSound = loadSound('hit.mp3');
  music = loadSound('music.mp3');
  boyImg = loadImage('boy2.png');
  mugImg = loadImage('mug2.png');
  barImg = loadImage('bar2.png');
}

function spawnMug() {
  if (lives <= 0) return;
  mug.x = random(270, 860);
  mug.alive = true;
  mug.timer = 180;
}

function setup() {
  createCanvas(960, 540);
  bulletX = 180;
  bulletY = 450;
  music.loop();
}

// ---- ЭКРАН СТАРТ ----
function drawStartScreen() {
  background(50, 45, 45);
  
  // персонаж на старте
  image(boyImg, 60, 80, 380, 380);
  
  // траектория пунктиром
  noFill();
  stroke(255, 180, 0);
  strokeWeight(3);
  drawingContext.setLineDash([10, 10]);
  beginShape();
  for (let i = 0; i < 60; i++) {
    let x = 200 + i * 13;
    let y = 180 - sin(i * 0.15) * 120 + i * 1.5;
    vertex(x, y);
  }
  endShape();
  drawingContext.setLineDash([]);
  
  // шарик на конце траектории
  noStroke();
  fill(255, 180, 0);
  circle(820, 280, 20);
  
  // название
  noStroke();
  fill(255);
  textFont("Impact");
  textSize(90);
  textAlign(CENTER);
  text("CRACHAT PRÉCISE !", 480, 420);
  
  // кнопка старт
  fill(255, 165, 0);
  noStroke();
  rect(380, 450, 200, 55, 8);
  fill(150, 50, 0);
  textSize(28);
  textAlign(CENTER);
  text("START", 480, 487);
}

// ---- ЭКРАН ИГРЫ ----
function drawGame() {
  image(barImg, 0, 0, 960, 540);
  
  // таймер кружки
  if (mug.alive) {
    mug.timer = mug.timer - 1;
    if (mug.timer <= 0) {
      mug.alive = false;
      lives = lives - 1;
      if (lives > 0) {
        setTimeout(spawnMug, random(500, 1500));
      } else {
        gameState = "gameover";
      }
    }
  }
  
  // пуля летит
  if (shooting) {
    bulletX = bulletX + dirX;
    bulletY = bulletY + dirY;
  }
  
  // пуля ушла за экран
  if (bulletX > 960 || bulletX < 0 || bulletY < 0 || bulletY > 540) {
    bulletX = 180;
    bulletY = 450;
    shooting = false;
  }
  
  // коллизия
  if (shooting && mug.alive &&
      bulletX > mug.x && bulletX < mug.x + 140 &&
      bulletY > mug.y && bulletY < mug.y + 140) {
    
    exploding = true;
    explodeX = mug.x;
    explodeY = mug.y;
    explodeTimer = 20;
    hitSound.play();
    
    points = points + 1;
    mug.alive = false;
    bulletX = 180;
    bulletY = 450;
    shooting = false;
    
    if (lives > 0) {
      setTimeout(spawnMug, random(500, 1500));
    }
  }
  
  // взрыв
  if (exploding) {
    noStroke();
    fill(255, 200, 0, explodeTimer * 10);
    circle(explodeX + 70, explodeY + 70, explodeTimer * 8);
    explodeTimer = explodeTimer - 1;
    if (explodeTimer <= 0) exploding = false;
  }
  
  // кружка
  if (mug.alive) {
    noStroke();
    fill(50, 50, 50);
    rect(mug.x, mug.y - 12, 140, 6);
    fill(150, 150, 150);
    rect(mug.x, mug.y - 12, 140 * (mug.timer / 180), 6);
    image(mugImg, mug.x, mug.y, 180, 180);
  }
  
  // пуля
  if (shooting) {
    noStroke();
    fill(255, 100, 50);
    circle(bulletX, bulletY, 8);
  }
  
  // хулиган
  let angle = atan2(mouseY - 450, mouseX - 180);
  angle = constrain(angle, -PI/4, PI/40);
  push();
  translate(180, 450);
  rotate(angle);
  image(boyImg, -240, -240, 480, 480);
  pop();
  
  // интерфейс
  noStroke();
  fill(255);
  textFont("Impact");
  textSize(22);
  textAlign(LEFT);
  text("POINTS: " + points, 20, 30);
  text("LIVES: " + lives, 20, 55);
}

// ---- ЭКРАН GAME OVER ----
function drawGameOverScreen() {
  background(50, 45, 45);
  
  // персонаж понурый
  image(boyImg, 350, 60, 260, 260);
  
  // текст
  noStroke();
  fill(255);
  textFont("Impact");
  textSize(90);
  textAlign(CENTER);
  text("GAME OVER", 480, 380);
  
  textSize(28);
  fill(255, 180, 0);
  text("POINTS: " + points, 480, 430);
  
  // кнопка restart
  fill(255, 165, 0);
  noStroke();
  rect(380, 455, 200, 55, 8);
  fill(150, 50, 0);
  textSize(28);
  text("RESTART", 480, 492);
}

// ---- ГЛАВНЫЙ DRAW ----
function draw() {
  if (gameState == "start") {
    drawStartScreen();
  } else if (gameState == "playing") {
    drawGame();
  } else if (gameState == "gameover") {
    drawGameOverScreen();
  }
}

// ---- КЛИКИ ----
function mousePressed() {
  // старт
  if (gameState == "start") {
    if (mouseX > 380 && mouseX < 580 && mouseY > 450 && mouseY < 505) {
      gameState = "playing";
      spawnMug();
    }
    return;
  }
  
  // рестарт
  if (gameState == "gameover") {
    if (mouseX > 380 && mouseX < 580 && mouseY > 455 && mouseY < 510) {
      points = 0;
      lives = 3;
      bulletX = 180;
      bulletY = 450;
      shooting = false;
      gameState = "playing";
      spawnMug();
    }
    return;
  }
  
  // стрельба
  if (gameState == "playing" && !shooting) {
    shooting = true;
    shotSound.play();
    let angle = atan2(mouseY - 450, mouseX - 180);
    angle = constrain(angle, -PI/4, PI/40);
    dirX = cos(angle) * 8;
    dirY = sin(angle) * 8;
  }
}