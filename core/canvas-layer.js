import { createCanvas } from "./canvas.js";
import CanvasItem from "./canvas-item.js";
import Node, { PauseMode, traverseTrees } from "./node.js";

export default class CanvasLayer extends Node {
  constructor(viewport, zIndex, id) {
    super();
    this.setPauseMode(PauseMode.Process);
    this.viewport = viewport;
    this.zIndex = zIndex;
    this.id = id;
    this.followViewportEnable = false;
  
    // 直接或间接子级的CanvasItem
    this.canvasItems = [];

    const canvas = createCanvas(viewport.width, viewport.height, id);
    canvas.style.zIndex = zIndex;
    this.canvas = canvas;
    this.context2d = canvas.getContext('2d');
  }
  
  enterTree() {
    document.body.appendChild(this.canvas);
  }

  exitTree() {
    document.body.removeChild(this.canvas);
  }

  add(node) {
    super.add(node);
    node.context2d = this.context2d;
  }

  update(delta) {
    this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const { canvasItems } = this;
    for (let i = canvasItems.length - 1; i >= 0; i--) {
      canvasItems[i].draw(delta);
    }
  }
}