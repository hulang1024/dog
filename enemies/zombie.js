import { SpriteAnimation } from "../animation.js";
import { Sound2D } from "../sound.js";
import { randomRange } from "../random.js";
import Enemy from "./enemy.js";

export default class Zombie extends Enemy {
  constructor(game) {
    super(game, 1);
    this.width = 71;
    this.height = 100;
    this.position.x = game.camera.position.x + game.viewportWidth;
    this.position.y = game.viewportHeight - game.bottomMargin - this.height;
    this.speed = randomRange(1, 6) * 20;

    const animation = new SpriteAnimation();
    animation.image = document.getElementById('enemy-zombie');
    animation.spriteWidth = 292;
    animation.spriteHeight = 410;
    animation.animations =  {
      move: {
        frameRow: 0,
        frameLength: 8,
      }
    };
    this.add(animation);

    animation.play('move');

    this.sound = new Sound2D('assets/sounds/zombie11.wav', this.game);
    this.sound.volumeFactor = 0.8;
    this.add(this.sound);
  }

  update(delta) {
    super.update(delta);
    this.position.x -= this.speed * delta;
    if (this.position.distance(this.player.position) < this.player.width + 200) {
      this.sound.play();
    }
  }
}