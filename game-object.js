import Vector2 from "./vector.js";
import Game from "./game.js";

export default class GameObject {
  constructor() {
    this.position = Vector2.Zero();
    this.width = 0;
    this.height = 0;
    this.parent = null;
    this.children = [];
    this.isQueuedForDelete = false;
  }

  add(o) {
    o.parent = this;
    this.children.push(o);
  }

  getChildren() {
    return this.children;
  }

  remove(child) {
    const i = this.children.indexOf(child);
    if (i > -1) {
      this.children.splice(i, 1);
    }
  }

  queueDelete() {
    this.isQueuedForDelete = true;
  }

  update(delta) {}

  draw(context) {
    if (Game.isDebugMode && Game.debugOptions.enableBox) {
      context.strokeStyle = '#0000ff';
      const parentX = this.parent ? this.parent.position.x : 0;
      const parentY = this.parent ? this.parent.position.y : 0;
      context.strokeRect(
        parentX + this.position.x,
        parentY + this.position.y,
        this.width, this.height);
    }
  }

  onKeyPressed(key) {
    this.children.forEach((child) => {
      child.onKeyPressed(key);
    });
  }

  onKeyReleased(key) {
    this.children.forEach((child) => {
      child.onKeyReleased(key);
    });
  }
}