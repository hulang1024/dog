import { SpriteAnimation } from "../animation.js";
import { randomRange } from "../core/random.js";
import Enemy from "./enemy.js";
import ImageUtils from "../core/image-utils.js";

export default class Worm extends Enemy {
  constructor(game) {
    super(game, 1);
    this.width = randomRange(50, 70);
    this.height = Math.round(this.width * 0.75);
    this.position.x = game.camera.position.x + game.width;
    this.position.y = game.height - game.background.bottomMargin - this.height;
    this.speed = randomRange(1, 3) * 20;

    const animation = new SpriteAnimation('worm');
    animation.spriteSheetImage = ImageUtils.getImage('enemy-worm');
    animation.spriteWidth = 80;
    animation.spriteHeight = 60;
    animation.animations =  {
      move: {
        frameRow: 0,
        frameLength: 6,
      }
    };
    this.add(animation);

    animation.play('move');
  }

  update(delta) {
    super.update(delta);
    this.position.x -= this.speed * delta;
  }
}