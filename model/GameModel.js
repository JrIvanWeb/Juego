const GRID = 16;

class GameModel {
  constructor() {
    this.best = 0;
    this.reset();
  }

  reset() {
    this.snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
    this.nextDir = 'RIGHT';
    this.dir = 'RIGHT';
    this.score = 0;
    this.level = 1;
    this.gameOver = false;
    this.running = false;
    this.spawnFood();
  }

  spawnFood() {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID),
        y: Math.floor(Math.random() * GRID)
      };
    } while (this.snake.some(s => s.x === pos.x && s.y === pos.y));
    this.food = pos;
  }

  setDir(d) {
    const opp = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (d && opp[d] !== this.dir) this.nextDir = d;
  }

  tick() {
    if (!this.running || this.gameOver) return false;
    this.dir = this.nextDir;
    const head = { ...this.snake[0] };

    if (this.dir === 'UP')    head.y--;
    if (this.dir === 'DOWN')  head.y++;
    if (this.dir === 'LEFT')  head.x--;
    if (this.dir === 'RIGHT') head.x++;

    if (
      head.x < 0 || head.x >= GRID ||
      head.y < 0 || head.y >= GRID ||
      this.snake.some(s => s.x === head.x && s.y === head.y)
    ) {
      this.gameOver = true;
      this.running = false;
      if (this.score > this.best) this.best = this.score;
      return false;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10 * this.level;
      this.level = Math.floor(this.score / 50) + 1;
      this.spawnFood();
    } else {
      this.snake.pop();
    }

    return true;
  }
}
