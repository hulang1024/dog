import { SpriteAnimation } from "../animation.js";
import { Sound2D } from "../core/sound.js";
import { randomRange } from "../core/random.js";
import Enemy from "./enemy.js";
import { StateId } from "../player/state/state.js";
import ImageUtils from "../core/image-utils.js";

export default class Zombie extends Enemy {
  constructor(game) {
    super(game, 1);
    this.width = randomRange(90, 120);
    this.height = Math.round(this.width * 1.408);
    this.position.x = game.camera.position.x + game.width;
    this.position.y = game.height - game.background.bottomMargin - this.height;
    this.speed = randomRange(1, 6) * 20;

    const animation = new SpriteAnimation('zombie');
    animation.spriteSheetImage = ImageUtils.getImage('enemy-zombie');
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
    this.sound.volumeFactor = 0.5;
    this.add(this.sound);
  }

  update(delta) {
    super.update(delta);
    this.position.x -= this.speed * delta;
    const { player } = this;
    if ((player.nowState.id == StateId.Sitting ||
         player.nowState.id == StateId.Standing) &&
        this.position.distanceTo(player.position) < player.width + 100) {
      this.sound.play();
    }
  }
}