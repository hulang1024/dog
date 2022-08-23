import { SpriteAnimation } from "../animation.js";
import ImageUtils from "../core/image-utils.js";
import { random, randomRange } from "../core/random.js";
import Enemy from "./enemy.js";

export default class BaseBat extends Enemy {
  constructor(game) {
    super(game, 2);
    this.width = randomRange(83, 100)
    this.height = Math.round(this.width * 0.53);
    this.position.x = game.camera.position.x + game.width;
    this.position.y = randomRange(this.height, game.height - this.height * 2);
    this.swayRange = 3 * 60;
  }

  update(delta) {
    super.update(delta);
    this.position.x += randomRange(-this.swayRange, this.swayRange) * delta;
    this.position.y += randomRange(-this.swayRange, this.swayRange) * delta;
  }
}

export class Bat1 extends BaseBat {
  constructor(game) {
    super(game, 2);
    this.width = randomRange(83, 100)
    this.height = Math.round(this.width * 0.53);
  }

  enterTree() {
    const animation = new SpriteAnimation('bat1');
    animation.spriteSheetImage = ImageUtils.getImage('enemy-bat1');
    animation.spriteWidth = 83;
    animation.spriteHeight = 44;
    animation.animations =  {
      loop: {
        frameRow: 0,
        frameLength: 6,
      }
    };
    animation.fps = randomRange(15, 61);
    this.add(animation);

    animation.play('loop');
  }
}

export class Bat2 extends BaseBat {
  constructor(game) {
    super(game, 2);
    this.width = randomRange(83, 100)
    this.height = Math.round(this.width * 0.701);
  }

  enterTree() {
    const animation = new SpriteAnimation('bat2');
    animation.spriteSheetImage = ImageUtils.getImage('enemy-bat2');
    animation.spriteWidth = 238;
    animation.spriteHeight = 167;
    animation.animations =  {
      loop: {
        frameRow: 0,
        frameLength: 6,
      }
    };
    animation.fps = randomRange(15, 61);
    this.add(animation);

    animation.play('loop');
  }
}