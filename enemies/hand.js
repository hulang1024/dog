import { SpriteAnimation } from "../animation.js";
import ImageUtils from "../core/image-utils.js";
import { randomRange } from "../core/random.js";
import Enemy from "./enemy.js";

export default class Hand extends Enemy {
  constructor(game) {
    super(game, 1);
    this.width = 56
    this.height = 80;
    this.position.x = game.camera.position.x + game.width;
    this.position.y = game.height - this.height - game.background.bottomMargin;
  
    const animation = new SpriteAnimation('hand');
    animation.spriteSheetImage = ImageUtils.getImage('enemy-hand');
    animation.spriteWidth = 56;
    animation.spriteHeight = 80;
    animation.animations =  {
      loop: {
        frameRow: 0,
        frameLength: 8,
      }
    };
    animation.fps = 10;
    this.add(animation);

    animation.play('loop');
  }
}