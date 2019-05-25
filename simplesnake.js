const board = document.querySelector('div');
const score = document.querySelector('span');
const snake = [{x: 5, y: 7}, {x: 5, y: 8}, {x: 5, y: 9}];
let food = {x: 5, y: 2};
let direction = 'N';
let directionBuffer = 'N';
let gameOver = false;
const field = [];

for (let i = 0; i < 10; i++) {
  field.push([]);
  for (let j = 0; j < 10; j++) {
    field[i].push('□');
  }
}

const placeFood = () => {
  let onSnake = true;
  const result = {};
  while (onSnake) {
    result.x = Math.floor(Math.random() * 10);
    result.y = Math.floor(Math.random() * 10);
    onSnake = snake.some(tile => tile.x === result.x && tile.y === result.y);
  }
  return result;
};

const drawBoard = () => {
  field[food.y][food.x] = '■';
  snake.forEach((tile) => { field[tile.y][tile.x] = '■'; });

  board.textContent = '';
  field.forEach((row, index) => {
    row.forEach((tile) => { board.textContent += tile; });
    board.textContent = index < field.length -1 ? board.textContent + '\n' : board.textContent;
  });
};

const getTarget = () => {
  const directions = {
    N: { x: snake[0].x, y: snake[0].y - 1 },
    S: { x: snake[0].x, y: snake[0].y + 1 },
    W: { x: snake[0].x - 1, y: snake[0].y },
    E: { x: snake[0].x + 1, y: snake[0].y },
  }
  return directions[direction];
};

const moveSnake = () => {
  let target = getTarget();
  let selfCrash = snake.some(tile => tile.x === target.x && tile.y === target.y);
  let wallCrash = target.y < 0 || target.y >= field.length || target.x < 0 || target.x >= field[0].length;

  if (selfCrash || wallCrash) {
    gameOver = true;
    score.textContent += ' (Game Over)';
    return;
  }

  let tempTile = {};
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      if (food && target.x === food.x && target.y === food.y) {
        snake.splice(0, 0, {x: food.x, y: food.y});
        score.textContent = parseInt(score.textContent) + 1;
        food = placeFood();
        break;
      }
      tempTile = {x: snake[0].x, y: snake[0].y};
      snake[0] = target;
    } else {
      const tempTile2 = {...snake[i]};
      snake[i] = {...tempTile};
      tempTile = {...tempTile2};
      field[tempTile2.y][tempTile2.x] = i === snake.length - 1 ? '□' : '■';
    }
  };
};

const setDirection = () => {
  if (directionBuffer === 'N' && direction !== 'S') { direction = 'N'; }
  if (directionBuffer === 'S' && direction !== 'N') { direction = 'S'; }
  if (directionBuffer === 'W' && direction !== 'E') { direction = 'W'; }
  if (directionBuffer === 'E' && direction !== 'W') { direction = 'E'; }
};

window.addEventListener('keydown', (e) => {
  if (e.keyCode === 38) { directionBuffer = 'N'; }
  if (e.keyCode === 40) { directionBuffer = 'S'; }
  if (e.keyCode === 37) { directionBuffer = 'W'; }
  if (e.keyCode === 39) { directionBuffer = 'E'; }
}, false);

setInterval(() => {
  if (!gameOver) {
    setDirection();
    moveSnake();
    drawBoard();
  }
}, 400);