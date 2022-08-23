import { PauseMode } from '../core/node.js';
import Node2D from '../core/node2d.js';
import { ShadowTextContext } from "../core/text.js";

export default class FloatingText extends Node2D {
  constructor(text, fontSize, fromPosition, toPosition) {
    super();
    this.setPauseMode(PauseMode.Stop);
    this.text = text;
    this.fontSize = fontSize;
    this.position = fromPosition;
    this.toPosition = toPosition;
    this.speed = 0.03 * 60;
    this.timer = 0;
  }

  enterTree() {
    this.shadowTextContext = new ShadowTextContext(this.context2d);
    this.shadowTextContext.set(2, 2, '#fff');
  }

  update(delta) {
    this.position.x += (this.toPosition.x - this.position.x) * this.speed * delta;
    this.position.y += (this.toPosition.y - this.position.y) * this.speed * delta;
    this.timer++;
    if (this.timer > 100) {
      this.queueFree();
    }
  }

  draw() {
    super.draw();
    this.context2d.save();
    this.context2d.font = this.fontSize + 'px Creepster';
    this.shadowTextContext.start();
    this.shadowTextContext.drawText(this.text, this.position.x, this.position.y);
    this.shadowTextContext.end();
    this.context2d.restore();
  }
}