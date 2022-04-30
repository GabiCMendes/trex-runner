var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOver, gameOverImage;
var restart, restartImage;

var checkpoint;
var die;
var jump;

var  isCollide = false;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png")

  checkpoint = loadSound("checkpoint.mp3");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");


}

function setup() {
  createCanvas(600, 200);
  cloudsGroup = new Group()
  obstaclesGroup = new Group()



  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.debug = false
  trex.setCollider ("rectangle", -20, 0, 50, 80, 30)
 // trex.setCollider ("circle", 0, 0, 40)
 
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //crie Grupos de Obstáculos e Nuvens
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  console.log("Hello" + 5);
  
  score = 0;

  gameOver = createSprite(280, 100)
  gameOver.addImage(gameOverImage)
  gameOver.scale = 0.5

  restart = createSprite(280, 150)
  restart.addImage(restartImage)
  restart.scale = 0.5

  gameOver.visible = false
  restart.visible = false
}

function draw() {
  background(180);
  text("Score: "+ score, 500,50);
  
  if (trex.isTouching(obstaclesGroup)) {
    trex.changeAnimation("collided")
    gameState = END
   // die.play()
  if (!isCollide) {
    die.play()
  isCollide = true
  }
  
  }
  if(gameState === PLAY){
    score = score + Math.round(getFrameRate()/60);
   
    if (score %100 == 0 && score > 0) {
      checkpoint.play()
    }
    
    //mover o solo
    ground.velocityX = -(4 + score/100);
    if(keyDown("space")&& trex.y >= 100) {
      trex.velocityY = -13;
      jump.play()
    
    }
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
   //gere as nuvens
  
   spawnClouds();
   //gere obstáculos no solo
   spawnObstacles();
  }
  else if(gameState === END){
    //parar o solo
    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    gameOver.visible = true;
    restart.visible = true;
    if (mousePressedOver(restart)) {
      reset()
    }
 
  }
  
  
  
  trex.velocityY = trex.velocityY + 0.8
  
 
  
  trex.collide(invisibleGround);
  
 
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);

   
    // //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
   obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(3 + score/100);
    
     //atribuir vida útil à variável
    cloud.lifetime = 220;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
  }
  
} 

function reset(){
gameState = PLAY
gameOver.visible = false
restart.visible = false
obstaclesGroup.destroyEach()
cloudsGroup.destroyEach()
trex.changeAnimation("running")
score = 0

} 







