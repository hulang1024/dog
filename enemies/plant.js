import { SpriteAnimation } from "../animation.js";
import { randomRange } from "../random.js";
import Enemy from "./enemy.js";

export default class Plant extends Enemy {
  constructor(game) {
    super(game, 1);
    this.width = randomRange(60, 70)
    this.height = Math.round(this.width * 1.45);
    this.position.x = game.camera.position.x + game.viewportWidth;
    this.position.y = game.viewportHeight - this.height - game.bottomMargin;
  
    const animation = new SpriteAnimation();
    animation.image = document.getElementById('enemy-plant');
    animation.spriteWidth = 60;
    animation.spriteHeight = 87;
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