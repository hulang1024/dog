import { SpriteAnimation } from "../animation.js";
import { randomRange } from "../random.js";
import Enemy from "./enemy.js";

export default class Plant extends Enemy {
  constructor(game) {
    super(game);
    this.width = 60;
    this.height = 87;
    this.position.x = game.camera.position.x + randomRange(0, game.viewportWidth);
    this.position.y = game.viewportHeight - this.height - game.bottomMargin;
  
    const animation = new SpriteAnimation();
    animation.image = document.getElementById('enemy-plant');
    animation.spriteWidth = this.width;
    animation.spriteHeight = this.height;
    animation.animations =  {
      loop: {
        frameRow: 0,
        frameLength: 2,
      }
    };
    animation.intervelFps = 10;
    this.add(animation);

    animation.play('loop');
  }
}