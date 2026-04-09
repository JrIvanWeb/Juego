const GRID = 16;
const CANVAS_SIZE = 320;
const CELL = CANVAS_SIZE / GRID;

class GameView {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  render(model) {
    this._drawBackground();
    this._drawGrid();
    this._drawFood(model.food);
    this._drawSnake(model.snake);

    if (model.gameOver) {
      this._drawOverlay('Game Over', `Puntos: ${model.score}`);
    } else if (!model.running && model.score === 0) {
      this._drawOverlay(null, 'Pulsa Iniciar');
    }
  }

  _drawBackground() {
    this.ctx.fillStyle = this._isDark() ? '#1a1a18' : '#F1EFE8';
    this.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }

  _drawGrid() {
    this.ctx.strokeStyle = this._isDark() ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
    this.ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      this.ctx.beginPath(); this.ctx.moveTo(i * CELL, 0); this.ctx.lineTo(i * CELL, CANVAS_SIZE); this.ctx.stroke();
      this.ctx.beginPath(); this.ctx.moveTo(0, i * CELL); this.ctx.lineTo(CANVAS_SIZE, i * CELL); this.ctx.stroke();
    }
  }

  _drawFood(food) {
    this.ctx.fillStyle = this._isDark() ? '#E24B4A' : '#D85A30';
    const x = food.x * CELL + 2, y = food.y * CELL + 2, r = (CELL - 4) / 2;
    this.ctx.beginPath();
    this.ctx.arc(x + r, y + r, r, 0, Math.PI * 2);
    this.ctx.fill();
  }

  _drawSnake(snake) {
    const isDark = this._isDark();
    snake.forEach((seg, i) => {
      const x = seg.x * CELL + 1, y = seg.y * CELL + 1, s = CELL - 2;
      if (i === 0) {
        this.ctx.fillStyle = isDark ? '#5DCAA5' : '#1D9E75';
      } else {
        const t = i / snake.length;
        this.ctx.fillStyle = isDark
          ? `rgba(93,202,165,${0.9 - t * 0.5})`
          : `rgba(29,158,117,${0.9 - t * 0.5})`;
      }
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, s, s, 3);
      this.ctx.fill();
    });
  }

  _drawOverlay(title, subtitle) {
    const isDark = this._isDark();
    const W = CANVAS_SIZE;
    this.ctx.fillStyle = isDark ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.75)';
    this.ctx.fillRect(0, 0, W, W);

    if (title) {
      this.ctx.fillStyle = isDark ? '#F0997B' : '#D85A30';
      this.ctx.font = '500 22px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(title, W / 2, W / 2 - 12);
    }

    this.ctx.fillStyle = isDark ? '#9FE1CB' : '#0F6E56';
    this.ctx.font = '400 14px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(subtitle, W / 2, title ? W / 2 + 16 : W / 2);
  }

  _isDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
