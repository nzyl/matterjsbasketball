const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;
var canvas, angle, ground, cannon;
var balls = [];
var attempts = 5;
var isGameOver;
var bottom;
var hoop,hoopImg;
var backBoard;
var r;

function preload() {
  backgroundImg = loadImage("./assets/background.png");
  hoopImg = loadImage("./assets/hoop.png");
  hoop = loadImage("assets/hoop.png");
}

function setup() {
  canvas = createCanvas(1200,600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES)
  angle = 15

  r = Math.round(random(200,500));

  backBoard = Bodies.rectangle(1000, r, 10, 10, { isStatic: true });
  push();
  imageMode(CENTER);
  createImage(hoopImg, 1000, r, 50, 50);
  hoop = createSprite(1000,r);
  hoop.scale = 0.2;
  pop();
  
  

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  cannon = new Cannon(280, 350, 100, 50, angle);

}

function draw() {

  background(189);
  image(backgroundImg, 0, 0, width, height);
  image(hoopImg, 1000, r, 100, 100);
  Engine.update(engine);
  drawSprites();

  rect(1000, r, 10, 10);

  push();
  translate(ground.position.x, ground.position.y);
  fill("brown");
  rectMode(CENTER);
  rect(0, 0, width * 2, 1);
  pop();



  if(attempts===0){
    Lost();
  }
  if(attempts===-1){
    attempts=0;
  }

 

  push();
  imageMode(CENTER);
  pop();
  

  fill("#6d4c41");
  textSize(40);
  text(`Attempts left: ${attempts}`, width - 400, 50);
  textAlign(CENTER, CENTER);
  fill("white");
  textSize(20);
  text(`Use the left and right arrow`, width - 1000, 50);
  text(`keys to change the angle you want`, width - 1000, 70);
  text(`to shoot at and use the down arrow`, width - 1000, 90);
  text(`key to shoot the ball.`, width - 1000, 110);

   for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    collisionWithHoop(i);
  }

  cannon.display();
  
  
}


function keyPressed() {
  if (keyCode === DOWN_ARROW && !isGameOver) {
    var cannonBall = new CannonBall(cannon.x+50, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
    
  }
}

function collisionWithHoop(index) {
    if (balls[index] !== undefined) {
      var collision = Matter.SAT.collides(balls[index].body, backBoard.body);

      if (collision.collided) {
          gameOver();
        

        Matter.World.remove(world, balls[index].body);
        delete balls[index];
      }
    }
  }

function showCannonBalls(ball, index) {
  if (ball) {
    ball.display();
    ball.animate();
    if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
        if(!ball.isSink){
          ball.remove(index);
          ball.isSink=true;
        }
      
    }
  }
}



function keyReleased() {
  if (keyCode === DOWN_ARROW && !isGameOver) {
    balls[balls.length - 1].shoot();
    attempts-=1;
  }
}

function gameOver() {
  swal(
    {
      title: `You Won!!!`,
      text: "Thanks for playing!!",
      imageUrl:
        "https://th.bing.com/th/id/OIP.26FiYDxxysANNUhCDFK6xgHaGy?pid=ImgDet&rs=1",
      imageSize: "150x150",
      confirmButtonText: "Play Again"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}

function Lost() {
  swal(
    {
      title: `You Lost!!!`,
      text: "You ran out of attempts!!",
      imageUrl:
        "https://th.bing.com/th/id/OIP.hzb6s4s724VXc3vc0g8bRQHaHD?pid=ImgDet&rs=1",
      imageSize: "150x150",
      confirmButtonText: "Play Again"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}
