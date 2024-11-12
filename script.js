// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas size (double the original)
canvas.width = 800;
canvas.height = 600;

// Paddle and ball properties
let playerPaddle = {
  x: 10,
  y: canvas.height / 2 - 50,
  width: 20,
  height: 100,
  speed: 5
};

let computerPaddle = {
  x: canvas.width - 30,
  y: canvas.height / 2 - 50,
  width: 20,
  height: 100,
  speed: 5
};

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  dx: 5,
  dy: 5
};

// Score variables
let playerScore = 0;
let computerScore = 0;

// Function to draw paddles
function drawPaddle(paddle) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Function to draw the ball
function drawBall() {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

// Function to draw the score
function drawScore() {
  ctx.font = '30px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(playerScore, canvas.width / 4, 50);
  ctx.fillText(computerScore, 3 * canvas.width / 4, 50);
}

// Function to update the game state
function update() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update ball position
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with top and bottom walls
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // Ball collision with paddles
  if (ball.x + ball.radius > computerPaddle.x &&
      ball.x + ball.radius < computerPaddle.x + computerPaddle.width &&
      ball.y + ball.radius > computerPaddle.y &&
      ball.y - ball.radius < computerPaddle.y + computerPaddle.height) {
    ball.dx *= -1;
  }

  if (ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
      ball.x - ball.radius > playerPaddle.x &&
      ball.y + ball.radius > playerPaddle.y &&
      ball.y - ball.radius < playerPaddle.y + playerPaddle.height) {
    ball.dx *= -1;
  }

  // Ball out of bounds (scoring)
  if (ball.x - ball.radius < 0) {
    computerScore++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    playerScore++;
    resetBall();
  }

  // Computer paddle movement with randomness
  let randomFactor = Math.random() * 10 - 5; // Range from -5 to 5
  computerPaddle.y += (ball.y - computerPaddle.y) / 10 + randomFactor;

  // Keep computer paddle within bounds
  if (computerPaddle.y < 0) {
    computerPaddle.y = 0;
  } else if (computerPaddle.y + computerPaddle.height > canvas.height) {
    computerPaddle.y = canvas.height - computerPaddle.height;
  }

  // Draw everything
  drawPaddle(playerPaddle);
  drawPaddle(computerPaddle);
  drawBall();
  drawScore();

  // Game loop
  requestAnimationFrame(update);
}

// Function to reset the ball to the center
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
  ball.dy = (Math.random() > 0.5 ? 1 : -1) * 5;
}

// Start the game
update();

// Event listener for player paddle movement
document.addEventListener('mousemove', (event) => {
  playerPaddle.y = event.clientY - playerPaddle.height / 2;
});

// Draw the game title (outside of the update function)
ctx.font = '50px Arial';
ctx.fillStyle = '#fff';
ctx.fillText("APPA PONG", canvas.width / 2 - 100, 100);