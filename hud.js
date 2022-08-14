import GameObject from "./game-object.js";

const BASE_X = 20;
const BASE_Y = 40;

export class HUD extends GameObject {
  constructor(game) {
    super();
    this.game = game;
    this.camera = game.camera;
    this.livesImage = document.getElementById('lives');
  }

  draw(ctx) {
    this.camera.with(ctx, false, () => {
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 0;
      ctx.font = '30px Creepster';
      ctx.fillStyle = '#000';
      ctx.fillText('Score: ' + this.game.score, BASE_X, BASE_Y);
      ctx.fillText('Time:  ' + this.game.time.toFixed(1), BASE_X, BASE_Y + 40);
      ctx.fillText('Enemy: ' + this.game.enemies.length, BASE_X, BASE_Y + 80);

      this.drawLives(ctx);

      if (this.game.gameOver) {
        ctx.font = '60px Creepster';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.fillText('Game Over!',
          this.game.viewportWidth * 0.5, this.game.viewportHeight * 0.5);
      }
    });
  }

  drawLives(ctx) {
    const size = 25;
    for (let i = 0; i < this.game.lives; i++) {
      ctx.drawImage(this.livesImage, BASE_X + i * size, BASE_Y + 100, size, size);
    }
  }
}