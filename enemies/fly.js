import { SpriteAnimation } from "../animation.js";
import ImageUtils from "../core/image-utils.js";
import { Sound2D } from "../core/sound.js";
import { random, randomRange } from "../core/random.js";
import Enemy from "./enemy.js";

export default class Fly extends Enemy {
  constructor(game) {
    super(game, 3);
    this.width = randomRange(50, 70);
    this.height = Math.round(this.width * 0.733);
    this.position.x = game.camera.position.x + game.width;
    this.position.y = this.height + randomRange(10, 30);
    this.speed = randomRange(1, 5) * 60;
    this.angle = 0;
    this.angleSpeed = random() * 0.2 * 60;
    this.curve = randomRange(0, 2);
  }

  enterTree() {
    const animation = new SpriteAnimation('fly');
    animation.spriteSheetImage = ImageUtils.getImage('enemy-fly');
    animation.spriteWidth = 60;
    animation.spriteHeight = 44;
    animation.fps = 16;
    animation.animations =  {
      fly: {
        frameRow: 0,
        frameLength: 6,
      }
    };
    this.add(animation);

    animation.play('fly');

    this.sound = new Sound2D('assets/sounds/bird_flap.flac', this.game);
    this.sound.audio.playbackRate = 10;
    this.sound.audio.loop = true;
    this.sound.volumeFactor = 0.02;
    this.sound.play();
    this.add(this.sound);
  }

  update(delta) {
    super.update(delta);
    this.position.x -= this.speed * delta;
    this.position.y += this.curve * Math.sin(this.angle);
    this.angle += this.angleSpeed * delta;
  }
}