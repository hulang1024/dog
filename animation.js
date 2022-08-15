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
    this.animationName = '';
    this.finishOnceCallbacks = {};
  }

  play(name) {
    this.animationName = name;
    const animation = this.animations[name];
    this.frameCol = 0;
    this.frameRow = animation.frameRow;
    this.frameLength = animation.frameLength;
    this.intervelTime = 0;
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
        this._emitFinish();
        if (!this.isPause) {
          this.frameCol = 0;
        }
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

  onFinishOnce(cb) {
    (this.finishOnceCallbacks[this.animationName] =
      this.finishOnceCallbacks[this.animationName] || []).push(cb);
  }

  _emitFinish() {
    const callbacks = this.finishOnceCallbacks[this.animationName];
    if (!callbacks) {
      return;
    }
    let callback;
    while (callback = callbacks.shift()) {
      callback();
    }
  }
}