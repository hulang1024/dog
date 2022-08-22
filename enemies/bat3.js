import { SpriteAnimation } from "../animation.js";
import ImageUtils from "../core/image-utils.js";
import { random, randomRange } from "../core/random.js";
import Enemy from "./enemy.js";

export default class Bat3 extends Enemy {
  constructor(game) {
    super(game, 3);
    this.position.x = game.camera.position.x + game.width;
    this.position.y = this.height + randomRange(10, 30);
    this.width = randomRange(100, 120)
    this.height = Math.round(this.width * 0.706);
    this.speed = randomRange(1, 5) * 62;
    this.angle = 0;
    this.angleSpeed = random() * 0.2 * 62;
    this.curve = randomRange(0, 2);
  }

  enterTree() {
    const animation = new SpriteAnimation('bat3');
    animation.spriteSheetImage = ImageUtils.getImage('enemy-bat3');
    animation.spriteWidth = 266;
    animation.spriteHeight = 188;
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

  update(delta) {
    super.update(delta);
    this.position.x -= this.speed * delta;
    this.position.y += this.curve * Math.sin(this.angle);
    this.angle += this.angleSpeed * delta;
  }
}