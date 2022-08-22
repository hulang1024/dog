import Node from "./node.js";
import Vector2 from './vector.js'

export default class CanvasItem extends Node {
  constructor() {
    super();
    this.context2d = null;
    // 有可能返回null，表示未绘制过
    this.transform = null;
  }

  draw() {}

  drawImage(image, dx, dy, dw, dh) {
    const p = this._transform2(dx, dy);
    this.context2d.drawImage(image, p.x, p.y, (0.5 + dw) << 0, (0.5 + dh) << 0);
  }

  drawArc(position, radius, startAngle, endAngle, color) {
    const p = this._transform(position);
    this.context2d.beginPath();
    this.context2d.arc(p.x, p.y, radius, startAngle, endAngle);
    this.context2d.fillStyle = color;
    this.context2d.fill();
  }

  drawLine(from, to, color, width = 1) {
    const from1 = this._transform(from);
    const to1 = this._transform(to);
    this.context2d.beginPath();
    this.context2d.strokeStyle = color;
    this.context2d.lineWidth = width;
    this.context2d.moveTo(from1.x, from1.y);
    this.context2d.lineTo(to1.x, to1.y);
    this.context2d.stroke();
  }

  drawRect(x, y, width, height, color) {
    const p = this._transform2(x, y);
    this.context2d.save();
    this.context2d.strokeStyle = color;
    this.context2d.strokeRect(p.x, p.y, width, height);
    this.context2d.restore();
  }

  drawText(font, position, text, color) {
    const p = this._transform(position);
    this.context2d.save();
    this.context2d.font = font;
    this.context2d.fillStyle = color;
    this.context2d.fillText(text, p.x, p.y);
    this.context2d.restore();
  }

  _transform(p) {
    return this._transform2(p.x, p.y);
  }

  _transform2(x, y) {
    return new Vector2(
      (0.5 + x + this.transform.x) << 0,
      (0.5 + y + this.transform.y) << 0);
  }
}