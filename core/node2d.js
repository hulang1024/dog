import Vector2 from "./vector.js";
import Game from "../game.js";
import Node from "./node.js";
import CanvasItem from "./canvas-item.js";

export default class Node2D extends CanvasItem {
  constructor() {
    super();
    this.position = Vector2.Zero();
    this.width = 0;
    this.height = 0;
  }

  draw() {
    if (Game.isDebugMode && Game.debugOptions.enableBox) {
      let pos;
      if (this.parent && this.parent instanceof Node2D) {
        pos = this.position.add(this.parent.position);
      } else {
        pos = this.position;
      }
      this.drawRect(pos.x, pos.y, this.width, this.height, '#0000ff');
    }
  }
}