import { SpriteAnimation } from "../animation.js";
import { randomRange } from "../random.js";
import Enemy from "./enemy.js";

export default class Fly extends Enemy {
  constructor(game) {
    super(game);
    this.width = 60;
    this.height = 44;
    this.position.x = game.camera.position.x + game.viewportWidth;
    this.position.y = this.height + randomRange(10, 30);
    this.speed = randomRange(1, 5) * 62;
    this.flapSpeed = Math.floor(randomRange(1, 4) * 62);
    this.angle = 0;
    this.angleSpeed = Math.random() * 0.2 * 62;
    this.curve = randomRange(0, 7);

    const animation = new SpriteAnimation();
    animation.image = document.getElementById('enemy-fly');
    animation.spriteWidth = this.width;
    animation.spriteHeight = this.height;
    animation.animations =  {
      fly: {
        frameRow: 0,
        frameLength: 6,
      }
    };
    this.add(animation);

    animation.play('fly');
  }

  update(delta) {
    super.update(delta);
    this.position.x -= this.speed * delta;
    this.position.y += this.curve * Math.sin(this.angle);
    this.angle += this.angleSpeed * delta;
  }
}