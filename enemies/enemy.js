import { PauseMode } from "../core/node.js";
import Node2D from "../core/node2d.js";

export default class Enemy extends Node2D {
  constructor(game, score) {
    super();
    this.setPauseMode(PauseMode.Stop);
    this.game = game;
    this.camera = game.camera;
    this.player = game.player;
    this.score = score;
    this.disappearOffCamera = true;
  }

  update(delta) {
    super.update(delta);
    if (this.disappearOffCamera && this.isOffCamera()) {
      this.queueFree();
    }
  }

  isOffCamera() {
    return this.position.x - this.camera.position.x < -this.width;
  }
}
