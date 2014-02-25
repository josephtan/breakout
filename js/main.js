var userAgent =  window.navigator.userAgent;
var body = document.getElementsByTagName("body")[0];
var IEver = getInternetExplorerVersion();
var life = 3;

/** function to get IE versions this is good to replace  the $.(browser) Jquery function that is absent on jquery 1.9 **/
function getInternetExplorerVersion()
// Returns the version of Windows Internet Explorer or a -1
// (indicating the use of another browser).
{
   var rv = -1; // Return value assumes failure.
   if (navigator.appName == 'Microsoft Internet Explorer')
   {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
         rv = parseFloat( RegExp.$1 );
   }
   return rv;
}

/* browser detection condition if IE or other browsers */
if (/MSIE (\d+\.\d+);/.test(userAgent)){
   if (IEver < 9){
       ErrorCanvasSupport();
        } 
      if (IEver >= 9){
             document.addEventListener("DOMContentLoaded", main, false);
      }
         }else{
             if(isCanvasSupported()){                
                  document.addEventListener("DOMContentLoaded", main, false);
             }else{
                  ErrorCanvasSupport();
             }
}

function isCanvasSupported(){
     var canvas = document.getElementById("gameframe");
     return !!(canvas.getContext && canvas.getContext("2d"));
}

function main(){   
    var canvas = document.getElementById("gameframe");
    var context = canvas.getContext("2d");
    var gameLoop;
    var score = 0;

    // main variables for color declaration, ball coordinate positioning and paddle Radius. 
    // Use with colors.black , colors.white and etc all in JSON
    
  var colors = {
      "black" : "#000",
      "white" : "#fff",
      "purple" : "#9b30ff",
      "orange" :"#ff900",
      "pink" : "#ff66cc",
      "cyan"  : "#99ccff",
      "red" : "#cc3333",
      "green" :"#66cc66",
      "blue" : "#003366"
    }    

    var ball = {
      "ballX" : "",
      "ballY" : "",
      "ballCenterX" : 5,
      "ballRadius" : 10,
      "ball.DeltaX" :"",
      "ball.DeltaY" :""
    }

    var paddle = {
      "paddleX" : "",
      "paddleY" : "",
      "paddleWidth" : 100,
      "paddleCenterX" : 50,
      "paddleHeight" : 15,   
      "paddleSpeedX" :10,
      "paddleMove" :""

    }



function random_number(min,max) {

    return (Math.round((max-min) * Math.random() + min));
}

function generate_random_numbers(num_elements,min,max) {

    var nums = new Array;

    for (var element=0; element<num_elements; element++) {
        nums[element] = random_number(min,max);
    }

    return (nums);
}

    var myNumArray = generate_random_numbers(10,1,4), myNumArray2 = generate_random_numbers(10,1,4),
        myNumArray3 = generate_random_numbers(10,1,4), myNumArray4 = generate_random_numbers(10,1,4);


    var bricksElements = {
      "bricks" : [myNumArray,myNumArray2,myNumArray3,myNumArray4],
      "brickWidth" : canvas.width/10,
      "brickHeight" : 20,
      
    }

    var sounds ={
      "bouncing" : new Audio("sounds/collision.ogg"),
      "breaking" :new Audio("sounds/explosion.ogg")
    }

    if (/MSIE (\d+\.\d+);/.test(userAgent)){                      
          if (IEver < 9){
           alert(IEver);
           document.attachEvent("onkeydown",getKeystrokeIE,true);
            }else{                 // repeated add Event Listener for IE version more than 9   
                startGame(); 
                window.addEventListener("keydown",getKeystroke, true); 
              }
            }else{  
                window.addEventListener("keydown",getKeystroke, true);    
                startGame();      
       }
    
    
  function drawPaddle(){
      var paddleImg = new Image();
      paddleImg.src = "images/paddle.png";
      //context.lineWidth = 30;
      //context.fillStyle = colorPurple;
      //context.fillRect(paddle.paddleX,paddle.paddleY,paddle.paddleWidth,paddle.paddleHeight);
      context.drawImage(paddleImg,paddle.paddleX,paddle.paddleY);

  }

  function drawBall(){
        var ballImg = new Image();
        ballImg.src = "images/ball.png";
     // draw ball with orange fill

      //context.fillStyle = colorOrange; 
      //context.fill();    
      context.beginPath(); 
     // context.arc(ball.ballX,ball.ballY,ball.ballRadius,0,Math.PI*2,true); 
     // draw a circle with arc method
      //context.stroke();
      context.drawImage(ballImg, ball.ballX - Math.PI*3.12, ball.ballY - Math.PI*3.12);
      //console.log(Math.PI*3.12);
  }

// draw a single brick
  function drawBrick(brickX,brickY,brickType){   
      switch(brickType){ // draw four colors for bricks
          case 1:
              context.fillStyle = colors.cyan;            
              break;
          case 2:
              context.fillStyle = colors.purple;                     
              break;
          case 3: context.fillStyle = colors.pink;
              break;
          case 4: context.fillStyle = colors.red;
              break;
          default:
              context.clearRect(brickX * bricksElements.brickWidth,brickY * bricksElements.brickHeight, bricksElements.brickWidth, bricksElements.brickHeight);
              break; 
      }
      
      if (brickType){
          //Draw rectangle with fillStyle color selected earlier
          context.strokeRect(brickX * bricksElements.brickWidth,brickY* bricksElements.brickHeight, bricksElements.brickWidth, bricksElements.brickHeight);
          context.lineWidth = 1;
          context.fillRect(brickX * bricksElements.brickWidth, brickY * bricksElements.brickHeight, bricksElements.brickWidth, bricksElements.brickHeight);
      } 
  }
 
// iterate through the bricks array and draw each brick using drawBrick()
  function createBricks(){
      for (var i=0; i < bricksElements.bricks.length; i++) {
          for (var j=0; j < bricksElements.bricks[i].length; j++) {
              drawBrick(j,i,bricksElements.bricks[i][j]);
          }
      }
  }
 
// function for showing a score board.
  function showScoreBoard(){
      //Set the text font and color
      context.fillStyle = colors.green;
      context.font = "20px Arial";     
      //Clear the bottom 30 pixels of the canvas
      //context.clearRect(0,canvas.height-30,canvas.width,30);  
      // Write Text 5 pixels from the bottom of the canvas
      context.fillText("Score:"+score,710, canvas.height - 15);
  }

  function showLife(){
    //Set the text font and color
      context.fillStyle = colors.red;
     // context.font = "20px Arial";     
      //Clear the bottom 30 pixels of the canvas
    //context.clearRect(0, canvas.height-15, 200 ,30);  
      // Write Text 5 pxels from the bottom of the canvas
      context.fillText("Lives:"+ life, 20 , canvas.height - 15);

  }


  function moveBall(){
      if (ball.ballY + ball.DeltaY - ball.ballRadius < 0 || collisionYWithBricks()){
      ball.DeltaY = -ball.DeltaY;
         sounds.bouncing.play();
      }

      // If the bottom of the ball touches the bottom of the screen then end the game
     if (ball.ballY + ball.DeltaY + ball.ballRadius >= canvas.height){
          life = life -=1;

          startGame();
         if(life === 0){  
          endGame();
        }
     }
  					// If side of ball touches either side of the wall then reverse X direction
  						//left of ball moves too far left
     if ((ball.ballX + ball.DeltaX - ball.ballRadius < 0) || (ball.ballX + ball.DeltaX + ball.ballRadius > canvas.width) || collisionXWithBricks()){  
  	 ball.DeltaX = -ball.DeltaX;
               sounds.bouncing.play();
     } 				
      

        // if bottom of ball reaches the top of paddle,
      if (ball.ballY + ball.DeltaY + ball.ballRadius >= paddle.paddleY){
  						// and it is positioned between the two ends of the paddle (is on top)
      if (ball.ballX + ball.DeltaX >= paddle.paddleX && ball.ballX + ball.DeltaX <= paddle.paddleX + paddle.paddleWidth){
              ball.DeltaY = - ball.DeltaY;
              sounds.bouncing.play();
              }
  	  } else if (ball.ballY + ball.DeltaY >= paddle.paddleHeight + paddle.paddleY){
          if (ball.ballX + ball.DeltaX >= paddle.paddleX && ball.ballX + ball.DeltaX >= paddle.paddleX + paddle.paddleWidth){
              ball.DeltaY = - ball.DeltaY;
               sounds.bouncing.play();
              }
          }
           // Move the ball
          ball.ballX = ball.ballX + ball.DeltaX;
          ball.ballY = ball.ballY + ball.DeltaY;
  }
   
  function movePaddle(){
          if (paddle.paddleMove == 'LEFT'){
              paddle.paddleDeltaX = -paddle.paddleSpeedX;
              } else if (paddle.paddleMove == 'RIGHT'){
                  paddle.paddleDeltaX = paddle.paddleSpeedX;
                  } else {
              paddle.paddleDeltaX = 0;
              }
             // If paddle reaches the ends, then don't let it move 
              if (paddle.paddleX + paddle.paddleDeltaX < 0 || paddle.paddleX + paddle.paddleDeltaX + paddle.paddleWidth > canvas.width){
              paddle.paddleDeltaX = 0; 
              }
              paddle.paddleX = paddle.paddleX + paddle.paddleDeltaX;
  }
    
  function collisionXWithPaddle(){
    var bumpedX = false;

    if (ball.ballX + ball.DeltaX + ball.ballRadius >= paddle.paddleCenterX && paddle.paddleWidth) {
    }
  }

  function collisionXWithBricks(){
      var bumpedX = false;    
      for (var i=0; i < bricksElements.bricks.length; i++) {
          for (var j=0; j < bricksElements.bricks[i].length; j++) {
              if (bricksElements.bricks[i][j]){ // if brick is still visible
                  var brickX = j * bricksElements.brickWidth;
                  var brickY = i * bricksElements.brickHeight;
                  if (
                      // barely touching from left
                      ((ball.ballX + ball.DeltaX + ball.ballRadius >= brickX) &&
                      (ball.ballX + ball.ballRadius <= brickX))
                      ||
                      // barely touching from right
                      ((ball.ballX + ball.DeltaX - ball.ballRadius<= brickX + bricksElements.brickWidth)&&
                      (ball.ballX - ball.ballRadius >= brickX + bricksElements.brickWidth))
                      ){      
                      if ((ball.ballY + ball.DeltaY -ball.ballRadius<= brickY + bricksElements.brickHeight) &&
                          (ball.ballY + ball.DeltaY + ball.ballRadius >= brickY)){                                                    
                          // weaken brick and increase score
                          explodeBrick(i,j);
                          bumpedX = true;
                      }
                  }
              }
          }
      }
     return bumpedX;
  }

  function collisionYWithBricks(){
      var bumpedY = false;
      for (var i=0; i < bricksElements.bricks.length; i++) {
          for (var j=0; j < bricksElements.bricks[i].length; j++) {
              if (bricksElements.bricks[i][j]){ // if brick is still visible
                  var brickX = j * bricksElements.brickWidth;
                  var brickY = i * bricksElements.brickHeight;
                  if (
                      // barely touching from below
                      ((ball.ballY + ball.DeltaY - ball.ballRadius <= brickY + bricksElements.brickHeight) && 
                      (ball.ballY - ball.ballRadius >= brickY + bricksElements.brickHeight))
                      ||
                      // barely touching from above
                      ((ball.ballY + ball.DeltaY + ball.ballRadius >= brickY) &&
                      (ball.ballY + ball.ballRadius <= brickY ))){
                      if (ball.ballX + ball.DeltaX + ball.ballRadius >= brickX && 
                          ball.ballX + ball.DeltaX - ball.ballRadius<= brickX + bricksElements.brickWidth){                                      
                          // weaken brick and increase score
                          explodeBrick(i,j);                          
                          bumpedY = true;
                      }                       
                  }
              }
          }
      }
      return bumpedY;
  }
 
  function explodeBrick(i,j){
    // First weaken the brick (0 means brick has gone)
 
    if (bricksElements.bricks[i][j] === 1 ){ 
       // Hit brick type 1
        score++;
        bricksElements.bricks[i][j] = 0;
        sounds.breaking.play();
    } 
   if (bricksElements.bricks[i][j] === 2 ){ 
       // Hit brick type 2
        score+=2;
        bricksElements.bricks[i][j] = 0;
        sounds.breaking.play();
    } 
    if (bricksElements.bricks[i][j] === 3 ){ 
       // Hit brick type 3
        score+=3;
        bricksElements.bricks[i][j] = 0;
        sounds.breaking.play();
    } 
      if (bricksElements.bricks[i][j] === 4 ){ 
        // Hit brick type 4
        score+=4;
        bricksElements.bricks[i][j] = 0;
        sounds.breaking.play();
    } else {
        // don't hit a brick get nothing 
        score += 0;   
        bricksElements.bricks[i][j] = 0;
       sounds.breaking.play();
    }
    
  }

  function framerate() {
    
          context.clearRect(0,0,canvas.width,canvas.height);     
          createBricks();
          showLife();
          showScoreBoard();         
          drawBall();  
          moveBall(); 
          movePaddle();
          drawPaddle();
          
  }

  function startGame(){
      clearInterval(gameLoop); // prevents framerate from accumilating when function is executed again from playagain button


      ball.ballX = 350, 
      ball.ballY = 540 - ball.ballRadius;  // put the ball in starting position again.
      paddle.paddleX = 350;
      paddle.paddleY = 540;

      ball.DeltaY = -4;
      ball.DeltaX = -2;
      paddle.paddleMove = 'NONE';
      paddle.paddleDeltaX = 0;      
      gameLoop = setInterval(framerate,10);

      }

      function endGame(){
              clearInterval(gameLoop);         
              context.fillStyle = colors.blue;
              context.fillText('Game Over!', canvas.width/2 - 50, canvas.height/2);

              replayButton();             
      }
      
      function replayButton(){
       //** redraw bricks when replay button is pressed *//

       myNumArray = generate_random_numbers(10,1,4), myNumArray2 = generate_random_numbers(10,1,4),
       myNumArray3 = generate_random_numbers(10,1,4), myNumArray4 = generate_random_numbers(10,1,4);

      bricksElements.bricks = [myNumArray,myNumArray2,myNumArray3,myNumArray4];

      //* draw play again button *//

       var buttonX = canvas.width/2 - 42,
       buttonY = canvas.height/2 + 130;
         elemLeft = canvas.offsetLeft,
         elemTop = canvas.offsetTop;
         elements = [];
         elements.push({
             width:100,
             height:30,
             top:buttonY,
             left:buttonX 
         });
        
     
         
         canvas.addEventListener('click', function(e){
         var x = e.pageX - elemLeft,
         y = e.pageY - elemTop;
   
        
      // Collision detection between clicked offset and element.
           elements.forEach(function(element) {
          if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
             context.clearRect(0, 0, canvas.width, canvas.height);
              life = 3;
              score = 0; 
              startGame();
    
              }
          });
          }, false);
       
              elements.forEach(function(element) { 
                  context.fillRect(element.left, element.top, element.width, element.height);
                  context.fillStyle = colors.white;
                  context.font = "16px Arial";  
                  context.fillText("Play Again?",element.left + 10,element.top + 20);
              });
  }
          
        
  function getKeystroke(e){
          document.onkeydown = function(e){ 
          var theKey = e.keyCode;
          switch (theKey){
              case 65 : movePaddle(paddle.paddleMove = "LEFT");
                  break;
              case 68 : movePaddle(paddle.paddleMove = "RIGHT");
                  break;  
              default : movePaddle(paddle.paddleMove = "NONE") ; 
              }  

          }      
  document.onkeyup = function(e){ 
          var theKey = e.keyCode;
          switch (theKey){
              case 65 : movePaddle(paddle.paddleMove = "NONE");
                  break;
              case 68 : movePaddle(paddle.paddleMove = "NONE");
                  break;  
              default : movePaddle(paddle.paddleMove = "NONE") ; 
              }  

          }
  }

}

function ErrorCanvasSupport(){
    
    alert ("Your browser doesn't support canvas!")
    
}


  


