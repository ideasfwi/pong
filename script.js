const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleHeight = 80;
const paddleWidth = 10;
const ballRadius = 10;

let playerX = 10;
let playerY = 150 - paddleHeight / 2;
let opponentX = canvas.width - paddleWidth - 10;
let opponentY = 150 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballDX = 5;
let ballDY = 5;

let playerScore = 0;
let opponentScore = 0;

function drawPaddle(x, y) {
  ctx.fillStyle = "#eee";
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.fillStyle = "#eee";
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#eee";
  ctx.fillText(playerScore, canvas.width / 4, 30);
  ctx.fillText(opponentScore, 3 * canvas.width / 4, 30);
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballDX = 5 * (Math.random() > 0.5 ? 1 : -1);
  ballDY = 5 * (Math.random() > 0.5 ? 1 : -1);
}

function checkCollision() {
  // Player paddle collision
  if (ballX - ballRadius < playerX + paddleWidth &&
      ballY > playerY && ballY < playerY + paddleHeight) {
    ballDX = -ballDX;
  }

  // Opponent paddle collision
  if (ballX + ballRadius > opponentX &&
      ballY > opponentY && ballY < opponentY + paddleHeight) {
    ballDX = -ballDX;
  }

  // Top and bottom wall collision
  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballDY = -ballDY;
  }

  // Score check
  if (ballX - ballRadius < 0) {
    opponentScore++;
    resetBall();
  }

  if (ballX + ballRadius > canvas.width) {
    playerScore++;
    resetBall();
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ballX += ballDX;
  ballY += ballDY;

  // Simple AI for opponent paddle
  if (ballY < opponentY + paddleHeight / 2 && opponentY > 0) {
    opponentY -= 5;
  } else if (ballY > opponentY + paddleHeight / 2 && opponentY + paddleHeight < canvas.height) {
    opponentY += 5;
  }

  checkCollision();
  drawPaddle(playerX, playerY);
  drawPaddle(opponentX, opponentY);
  drawBall();
  drawScore();

  // Update player paddle position based on touch
  playerY = touchY - paddleHeight / 2; // Adjust for paddle height

  requestAnimationFrame(update);
}

// Add event listeners for touch events
canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);

let touchY = 0; // Store the touch Y position

function handleTouchStart(event) {
  touchY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  touchY = event.touches[0].clientY;
}

update();