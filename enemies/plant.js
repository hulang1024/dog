import { SpriteAnimation } from "../animation.js";
import ImageUtils from "../core/image-utils.js";
import { randomRange } from "../core/random.js";
import Enemy from "./enemy.js";

export default class Plant extends Enemy {
  constructor(game) {
    super(game, 1);
    this.width = randomRange(60, 70)
    this.height = Math.round(this.width * 1.45);
    this.position.x = game.camera.position.x + game.width;
    this.position.y = game.background.floorY - this.height;
  }

  enterTree() {
    const animation = new SpriteAnimation('plant');
    animation.spriteSheetImage = ImageUtils.getImage('enemy-plant');
    animation.spriteWidth = 60;
    animation.spriteHeight = 87;
    animation.animations =  {
      loop: {
        frameRow: 0,
        frameLength: 2,
      }
    };
    animation.fps = 10;
    this.add(animation);

    animation.play('loop');
  }
}