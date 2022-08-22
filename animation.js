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
    this.scale = 1;
    this.frameCol = 0;
    this.frameRow = 0;
    this.frameLength = 6;
    // 动画名 -> 帧图像序列
    this._animationFrameImages = {};
    this.animations = {};
    this.isPause = true;
    this.animationName = '';
    this._currentAnimationFrameImages = [];
    this.finishOnceCallbacks = {};
  }

  enterTree() {
    this.parentPosition = this.parent.position;

    for (const animName in this.animations) {
      const anim = this.animations[animName];
      this._animationFrameImages[animName] = [];
      for (let col = 0; col < anim.frameLength; col++) {
        let cachedName = this.name;
        if (this.scale != 1) {
          cachedName += '_' + this.scale;
        }
        cachedName += '/' + animName + '/' + col;
        const cachedImage = ImageUtils.cachedRegion(
          cachedName,
          this.spriteSheetImage,
          col * this.spriteWidth, anim.frameRow * this.spriteHeight,
          this.spriteWidth, this.spriteHeight,
          0, 0, this.spriteWidth * this.scale, this.spriteHeight * this.scale);
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
    this._currentAnimationFrameImages = this._animationFrameImages[name];
  }

  pause() {
    this.isPause = true;
  }

  update(delta) {
    if (this.isPause) {
      return;
    }
    this.intervelTime += delta;
    if (this.intervelTime >= 1 / this.fps) {
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
      this._currentAnimationFrameImages[this.frameCol],
      this.parentPosition.x + this.position.x,
      this.parentPosition.y + this.position.y,
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