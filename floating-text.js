import GameObject from './game-object.js';

export default class FloatingText extends GameObject {
  constructor(game, text, fromPosition, toPosition) {
    super();
    this.text = text;
    this.position = fromPosition.subtract(game.camera.position);
    console.log(this.position);
    this.toPosition = toPosition;
    this.timer = 0;
    this.camera = game.camera;
  }

  update() {
    this.position.x += (this.toPosition.x - this.position.x) * 0.03;
    this.position.y += (this.toPosition.y - this.position.y) * 0.03;
    this.timer++;
    if (this.timer > 100) {
      this.queueDelete();
    }
  }

  draw(ctx) {
    this.camera.with(ctx, false, () => {
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 0;
      ctx.font = '20px Creepster';
      ctx.fillStyle = '#000';
      ctx.fillText(this.text, this.position.x, this.position.y);
    });
  }
}