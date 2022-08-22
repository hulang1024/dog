import { SpriteAnimation } from "../animation.js";
import ImageUtils from "../core/image-utils.js";
import { random, randomRange } from "../core/random.js";
import Enemy from "./enemy.js";

export default class Ghost1 extends Enemy {
  constructor(game) {
    super(game, 4);
    this.disappearOffCamera = false;
    this.width = randomRange(100, 120);
    this.height = Math.round(this.width * 0.811);
    this.position.x = game.camera.position.x + game.width;
    this.position.y = this.height + randomRange(10, 30);
    this.speed = randomRange(1, 3) * 62;
    this.angle = random() * game.height;
    this.angleSpeed = randomRange(0.5, 2);
    this.lieftime = 0;
  }

  enterTree() {
    const animation = new SpriteAnimation('ghost1');
    animation.spriteSheetImage = ImageUtils.getImage('enemy-ghost1');
    animation.spriteWidth = 218;
    animation.spriteHeight = 177;
    animation.fps = 10;
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
    if (this.isOffCamera() && this.lieftime > 10) {
      this.queueFree();
    }
    this.lieftime += delta;

    const halfWidth = this.game.width / 2;
    const halfHeight = this.game.height / 2;
    this.position.x = this.camera.position.x + halfWidth * Math.cos(this.angle * Math.PI / 200)
      + (halfWidth - this.width / 2);
    this.position.y = this.camera.position.y + halfHeight * Math.sin(this.angle * Math.PI / 300)
      + (halfHeight - this.height / 2)
    this.angle += this.angleSpeed;
  }
}