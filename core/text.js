/* 替代canvas的shadow效果，有更好的性能 */
export class ShadowTextContext {
  constructor(canvasContext) {
    this.canvasContext = canvasContext;
    this.offsetX = 0;
    this.offsetY = 0;
    this.shadowColor = '#fff';
  }

  set(offsetX, offsetY, shadowColor) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.shadowColor = shadowColor;
    this.lastFillStyle = null;
  }

  start() {
    this.items = [];
    this.lastFillStyle = this.canvasContext.fillStyle;
  }

  drawText(text, x, y) {
    this.items.push(new ShadowText(x, y, text));
  }

  end() {
    const ctx = this.canvasContext;

    let i, itemCount = this.items.length, item;

    ctx.fillStyle = this.shadowColor;
    for (i = 0; i < itemCount; i++) {
      item = this.items[i];
      ctx.fillText(item.text, item.x + this.offsetX, item.y + this.offsetY);
    }
  
    ctx.fillStyle = this.lastFillStyle;
    for (i = 0; i < itemCount; i++) {
      item = this.items[i];
      ctx.fillText(item.text, item.x, item.y);
    }

    this.items = [];
  }
}

class ShadowText {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
  }
}