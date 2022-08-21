import Node from "./node.js";
import Vector2 from "./vector.js";

export default class Viewport extends Node {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
    this.camera = null;
    this.canvasTransform = Vector2.Zero();
  }
}