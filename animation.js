import ImageUtils from "./core/image-utils.js";
import { PauseMode } from "./core/node.js";
import Node2D from "./core/node2d.js";

export class SpriteAnimation extends Node2D {
  constructor(name) {
    super();
    this.setPauseMode(PauseMode.Process);
    this.name = name;
    this.intervelTime = 0;
    this.fps = 20;
    this.spriteSheetImage = null;
    this.spriteWidth = 0;
    this.spriteHeight = 0;
    this.frameCol = 0;
    this.frameRow = 0;
    this.frameLength = 6;
    // 动画名 -> 帧图像序列
    this._animationFrameImages = {};
    this.animations = {};
    this.isPause = true;
    this.animationName = '';
    this.finishOnceCallbacks = {};
  }

  enterTree() {
    for (const animName in this.animations) {
      const anim = this.animations[animName];
      this._animationFrameImages[animName] = [];
      for (let col = 0; col < anim.frameLength; col++) {
        const cachedImage = ImageUtils.cachedRegion(
          this.name + '/' + animName + '/' + col,
          this.spriteSheetImage,
          col * this.spriteWidth, anim.frameRow * this.spriteHeight,
          this.spriteWidth, this.spriteHeight,
          0, 0, this.parent.width, this.parent.height);
        this._animationFrameImages[animName].push(cachedImage);
      }
    }
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
    if (this.intervelTime >= 1000 / this.fps / 1000) {
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

  draw() {
    this.drawImage(
      this._animationFrameImages[this.animationName][this.frameCol],
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