import GameObject from "./game-object.js";

export class SpriteAnimation extends GameObject {
  constructor() {
    super();
    this.intervelTime = 0;
    this.intervelFps = 20;
    this.image = null;
    this.spriteWidth = 0;
    this.spriteHeight = 0;
    this.frameCol = 0;
    this.frameRow = 0;
    this.frameLength = 6;
    this.animations = [];
    this.isPause = true;
    this.finishCallbacks = [];
  }

  play(name) {
    const animation = this.animations[name];
    this.frameCol = 0;
    this.frameRow = animation.frameRow;
    this.frameLength = animation.frameLength;
    this.isPause = false;
  }

  pause() {
    this.isPause = true;
  }

  update(delta) {
    if (this.isPause) {
      return;
    }
    this.intervelTime += delta;
    if (this.intervelTime >= 1000 / this.intervelFps / 1000) {
      if (this.frameCol < this.frameLength - 1) {
        this.frameCol++;
      } else {
        this.frameCol = 0;
        this.finishCallbacks.forEach(cb => cb());
      }
      this.intervelTime = 0;
    }
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.frameCol * this.spriteWidth, this.frameRow * this.spriteHeight,
      this.spriteWidth, this.spriteHeight,
      this.parent.position.x + this.position.x,
      this.parent.position.y + this.position.y,
      this.parent.width, this.parent.height);
  }

  addFinishCallback(cb) {
    this.finishCallbacks.push(cb);
  }

  removeFinishCallback(cb) {
    const i = this.finishCallbacks.indexOf(cb);
    if (i > -1) {
      this.finishCallbacks.splice(i, 1);
    }
  }
}