class GameController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.timer = null;

    document.addEventListener('keydown', this.onKey.bind(this));

    document.querySelectorAll('[data-dir]').forEach(btn => {
      btn.addEventListener('click', () => this.model.setDir(btn.dataset.dir));
    });

    document.getElementById('btn-start').addEventListener('click', () => this.start());
    document.getElementById('btn-pause').addEventListener('click', () => this.pause());
    document.getElementById('btn-reset').addEventListener('click', () => this.reset());
  }

  onKey(e) {
    const map = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT' };
    if (map[e.key]) { e.preventDefault(); this.model.setDir(map[e.key]); }
    if (e.key === ' ') this.pause();
  }

  getSpeed() {
    return Math.max(80, 180 - (this.model.level - 1) * 20);
  }

  start() {
    if (this.timer) return;
    if (this.model.gameOver) { this.reset(); return; }
    this.model.running = true;
    document.getElementById('btn-start').textContent = 'Jugando';
    this.scheduleNext();
  }

  scheduleNext() {
    this.timer = setTimeout(() => {
      this.model.tick();
      this.updateUI();
      this.view.render(this.model);
      if (this.model.running) {
        this.scheduleNext();
      } else {
        clearTimeout(this.timer);
        this.timer = null;
        this.updateUI();
      }
    }, this.getSpeed());
  }

  pause() {
    if (!this.model.running && this.timer === null && !this.model.gameOver) return;
    if (this.model.running) {
      this.model.running = false;
      clearTimeout(this.timer);
      this.timer = null;
      document.getElementById('btn-start').textContent = 'Reanudar';
    } else if (!this.model.gameOver) {
      this.start();
    }
    this.view.render(this.model);
  }

  reset() {
    clearTimeout(this.timer);
    this.timer = null;
    const best = this.model.best;
    this.model.reset();
    this.model.best = best;
    document.getElementById('btn-start').textContent = 'Iniciar';
    this.updateUI();
    this.view.render(this.model);
  }

  updateUI() {
    document.getElementById('score').textContent = this.model.score;
    document.getElementById('best').textContent = this.model.best;
    document.getElementById('level').textContent = this.model.level;
    if (this.model.gameOver) {
      document.getElementById('btn-start').textContent = 'Reiniciar';
    }
  }
}
