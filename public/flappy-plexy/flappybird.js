const canvas = document.getElementById('flappyBirdCanvas');
const ctx = canvas.getContext('2d');

// Resize the canvas to fill the window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Load images
const bird = new Image();
bird.src = 'plexy.png'; // Bird image

const pipe = new Image();
pipe.src = 'flappybird-pipe.png'; // Pipe image

const pipeTop = new Image();
pipeTop.src = 'flappybird-pipe-top.png'; // Pipe image

const background = new Image();
background.src = 'fb-game-background.png'; // Background image

const bottomBackground = new Image();
bottomBackground.src = 'bottom-background.png'; // Ground image

// Game variables
let birdX,
  birdY,
  birdWidth = 34,
  birdHeight = 34 * (910 / 749);
let gravity = 0.08,
  velocity,
  jumpHeight = -3;
let pipes,
  pipeWidth = 60,
  pipeGap = 250;
const pipeSpeed = 1;
let isGameOver, score;

// Initialize or reset game
function resetGame() {
  birdX = 50;
  birdY = 150;
  velocity = 0;
  pipes = [];
  isGameOver = false;
  score = 0;
  createPipe();
  gameLoop();
}

// Handle spacebar or click for jump
document.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    if (isGameOver) {
      resetGame();
    }
    velocity = jumpHeight;
  }
});

canvas.addEventListener('click', () => {
  if (!isGameOver) {
    velocity = jumpHeight;
  } else {
    resetGame();
  }
});

// Handle window resize
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial call to set canvas size

// Create pipes at regular intervals
function createPipe() {
  const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
  pipes.push({
    x: canvas.width,
    y: pipeHeight,
  });
}

// Draw bird
function drawBird() {
  ctx.drawImage(bird, birdX, birdY, birdWidth, birdHeight);
}

// Draw pipes
function drawPipes() {
  pipes.forEach(pipeData => {
    // Top pipe
    ctx.drawImage(
      pipeTop,
      pipeData.x,
      pipeData.y - pipe.height,
      pipeWidth,
      pipe.height
    );

    // Bottom pipe
    ctx.drawImage(
      pipe,
      pipeData.x,
      pipeData.y + pipeGap,
      pipeWidth,
      pipe.height
    );
  });
}

// Check for collisions
function checkCollision() {
  if (birdY + birdHeight >= canvas.height - 100) {
    // Bird hits the ground
    return true;
  }

  for (const pipe of pipes) {
    if (birdX < pipe.x + pipeWidth && birdX + birdWidth > pipe.x) {
      if (birdY < pipe.y || birdY + birdHeight > pipe.y + pipeGap) {
        return true;
      }
    }
  }

  return false;
}

// Draw background and ground
function drawBackground() {
  // Background
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Ground
  const groundHeight = 100;
  ctx.drawImage(
    bottomBackground,
    0,
    canvas.height - groundHeight,
    canvas.width,
    groundHeight
  );
}

// Update the game state
function update() {
  if (isGameOver) return;

  // Bird physics
  velocity += gravity;
  birdY += velocity;

  // Move pipes
  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;
  });

  // Remove off-screen pipes
  if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
    score++;
  }

  // Add new pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    createPipe();
  }

  // Check for collision
  if (checkCollision()) {
    isGameOver = true;
  }
}

// Draw everything on the canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  drawBackground();

  // Draw bird and pipes
  drawBird();
  drawPipes();

  // Display score
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 25);
}

// Game loop
function gameLoop() {
  update();
  draw();

  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillStyle = '#FF0000';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 115, canvas.height / 2);
  }
}

// Start the game
resetGame();
