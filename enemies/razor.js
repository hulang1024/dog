import { SpriteAnimation } from "../animation.js";
import ImageUtils from "../core/image-utils.js";
import { randomRange } from "../core/random.js";
import Vector2 from "../core/vector.js";
import Enemy from "./enemy.js";

export default class Razor extends Enemy {
  constructor(game) {
    super(game, 3);
    this.position.x = game.camera.position.x + game.width;
    this.position.y = this.height + randomRange(10, 30);
    this.width = randomRange(80, 100)
    this.height = Math.round(this.width * 0.995);
    this.newPos = null;
    this.intervel = randomRange(3, 5);
    this.timer = this.intervel + 1;
    this.maxSpeed = 71;
    this.speed = randomRange(50, this.maxSpeed);
  }

  enterTree() {
    const animation = new SpriteAnimation('razor');
    animation.spriteSheetImage = ImageUtils.getImage('enemy-razor');
    animation.spriteWidth = 213;
    animation.spriteHeight = 212;
    animation.animations =  {
      loop: {
        frameRow: 0,
        frameLength: 9,
      }
    };
    animation.fps = this.speed / this.maxSpeed * 60;
    this.add(animation);

    animation.play('loop');
  }

  update(delta) {
    super.update(delta);
    this.timer += delta;
    if (this.timer > this.intervel) {
      this.newPos = new Vector2(
        randomRange(0, game.width - this.width),
        randomRange(0, game.height - this.height));
      this.timer = 0;
    }
    this.position.x -= (this.position.x - this.newPos.x) / this.speed;
    this.position.y -= (this.position.y - this.newPos.y) / this.speed;
  }
}