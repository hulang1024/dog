import GameObject from "../game-object.js";

export default class Enemy extends GameObject {
  constructor(game, score) {
    super();
    this.game = game;
    this.player = game.player;
    this.score = score;
  }
}
