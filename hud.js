import CanvasLayer from "./core/canvas-layer.js";
import { createCanvas } from "./core/canvas.js";
import ImageUtils from "./core/image-utils.js";
import { PauseMode } from "./core/node.js";
import Game from "./game.js";

const BASE_X = 20;
const BASE_Y = 40;

export default class HUD extends CanvasLayer {
  constructor(game, viewport) {
    super(viewport, 1, 'hud');
    this.setPauseMode(PauseMode.Process);
    this.game = game;
    this.context2d.shadowOffsetX = 2;
    this.context2d.shadowOffsetY = 2;
    this.context2d.shadowColor = '#fff';
    this.context2d.shadowBlur = 0;
    this.context2d.font = '34px Creepster';
    this.context2d.fillStyle = '#000';

    this.liveImages = [];
    this.preDrawLives(this.game.maxLives);
  }

  update(delta) {
    super.update(delta);
    this.context2d.fillText('Score: ' + this.game.score, BASE_X, BASE_Y);
    this.context2d.fillText('Time:  ' + this.game.time.toFixed(1), BASE_X, BASE_Y + 40);
    this.context2d.fillText('Enemy: ' + this.game.enemyManager.count(), BASE_X, BASE_Y + 80);

    if (this.game.lives > 0) {
      this.context2d.drawImage(this.liveImages[this.game.lives - 1],
        BASE_X, BASE_Y + 100);
    }

    if (this.game.isGameOver) {
      this.context2d.save();
      this.context2d.font = '60px Creepster';
      this.context2d.textAlign = 'center';
      this.context2d.fillText('Game Over!',
        this.game.width * 0.5, this.game.height * 0.5);
        this.context2d.font = '40px Creepster';
      this.context2d.fillText('Press Enter To Restart',
      this.game.width * 0.5, this.game.height * 0.5 + 50);
      this.context2d.restore();
    } else if (this.game.isPause) {
      this.context2d.save();
      this.context2d.font = '60px Creepster';
      this.context2d.textAlign = 'center';
      this.context2d.fillText('Press Enter to Start!',
      this.game.width * 0.5, this.game.height * 0.5);
      this.context2d.restore();
    }
  }

  preDrawLives(maxLives) {
    const size = 25 / 1.7;
    const dogImage = ImageUtils.getImage('lives');
    for (let lives = 1; lives <= maxLives; lives++) {
      const canvas = createCanvas(size * lives, size);
      const ctx = canvas.getContext('2d');
      for (let i = 0; i < lives; i++) {
        ctx.drawImage(dogImage, i * size, 0, size, size);
      }
      this.liveImages.push(canvas);
    }
  }
}