'use strict';

const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');

const scoreHeading = document.querySelector('.score');

scoreHeading.textContent = 'Score: ';

const snake = [
  {
    x: 150, y: 150,
  },
  {
    x: 140, y: 150,
  },
  {
    x: 130, y: 150,
  },
  {
    x: 120, y: 150,
  },
];

let score = 0;
let dx = 10;
let dy = 0;
let foodX;
let foodY;
let changingDirection = false;

startGame();
createFood();

document.addEventListener('keydown', changeDirection);

function startGame() {
  if (gameEnd()) {
    setTimeout(function() {
      showFailImg();
      clearCanvas();
    }, 100);

    return;
  }

  setTimeout(function onTick() {
    changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    startGame();
  }, 100);
};

function clearCanvas() {
  ctx.fillStyle = 'black';
  ctx.strokestyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
};

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.strokestyle = 'red';
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
};

function advanceSnake() {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy,
  };

  snake.unshift(head);

  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;

  if (didEatFood) {
    score += 10;
    scoreHeading.textContent = `Score: ${score}`;
    createFood();
  } else {
    snake.pop();
  }
};

function showFailImg() {
  const failEmoji = document.querySelector('.fail__emoji');

  failEmoji.classList.remove('hidden');

  scoreHeading.textContent = `Oops!`;
};

function gameEnd() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x
      && snake[i].y === snake[0].y) {
      return true;
    }
  }

  const leftWall = snake[0].x <= 0;
  const rightWall = snake[0].x >= canvas.width - 10;
  const topWall = snake[0].y <= 0;
  const bottomWall = snake[0].y >= canvas.height - 10;

  return leftWall || rightWall || topWall || bottomWall;
};

function randomNums(min, max) {
  return Math.round(
    (Math.random() * (max - min) + min) / 10) * 10;
};

function createFood() {
  foodX = randomNums(0, canvas.width - 10);
  foodY = randomNums(0, canvas.height - 10);

  snake.forEach(function isEaten(part) {
    const foodEaten = (part.x === foodX) && (part.y === foodY);

    if (foodEaten) {
      createFood();
    }
  });
};

function drawSnake() {
  snake.forEach(drawSnakePart);
};

function drawSnakePart(snakePart) {
  ctx.fillStyle = 'lightgreen';
  ctx.strokestyle = 'lightgreen';
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
};

function changeDirection(evnt) {
  const left = 37;
  const right = 39;
  const up = 38;
  const down = 40;

  if (changingDirection) {
    return;
  }

  // eslint-disable-next-line no-func-assign
  changeDirection = true;

  const keyPressed = evnt.keyCode;

  const moveLeft = dx === -10;
  const moveRight = dx === 10;
  const moveUp = dy === -10;
  const moveDown = dy === 10;

  if (keyPressed === left && !moveRight) {
    dx = -10;
    dy = 0;
  }

  if (keyPressed === up && !moveDown) {
    dx = 0;
    dy = -10;
  }

  if (keyPressed === right && !moveLeft) {
    dx = 10;
    dy = 0;
  }

  if (keyPressed === down && !moveUp) {
    dx = 0;
    dy = 10;
  }
};
