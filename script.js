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

// Difficulty settings
let difficulty = 'medium'; // Default difficulty

// Set ball speed based on difficulty
function setDifficulty(level) {
  switch (level) {
    case 'easy':
      ball.dx = 7;
      ball.dy = 7;
      break;
    case 'medium':
      ball.dx = 10;
      ball.dy = 10;
      break;
    case 'hard':
      ball.dx = 13;
      ball.dy = 13;
      break;
  }
}

// Event listeners for difficulty buttons
document.getElementById('easy').addEventListener('click', () => {
  difficulty = 'easy';
  setDifficulty(difficulty);
  resetGame();
});

document.getElementById('medium').addEventListener('click', () => {
  difficulty = 'medium';
  setDifficulty(difficulty);
  resetGame();
});

document.getElementById('hard').addEventListener('click', () => {
  difficulty = 'hard';
  setDifficulty(difficulty);
  resetGame();
});

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

// Function to reset the ball and game state
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = (Math.random() > 0.5 ? 1 : -1) * Math.abs(ball.dx);
  ball.dy = (Math.random() > 0.5 ? 1 : -1) * Math.abs(ball.dy);
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  resetBall();
}

// Start the game with default difficulty
setDifficulty(difficulty);
update();

// Event listener for player paddle movement (mouse)
document.addEventListener('mousemove', (event) => {
  playerPaddle.y = event.clientY - playerPaddle.height / 2;
});

// Event listener for player paddle movement (touchscreen)
canvas.addEventListener('touchmove', (event) => {
  event.preventDefault();
  const touch = event.touches[0];
  const rect = canvas.getBoundingClientRect();
  const touchY = touch.clientY - rect.top;
  playerPaddle.y = touchY - playerPaddle.height / 2;
});
