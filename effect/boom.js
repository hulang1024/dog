import GameObject from "../game-object.js";
import { SpriteAnimation } from "../animation.js";

export default class Boom extends GameObject {
  constructor(x, y) {
    super();
    this.width = 100;
    this.height = 90;
    this.position.x = x;
    this.position.y = y;
    const animation = new SpriteAnimation();
    animation.image = document.getElementById('boom');
    animation.spriteWidth = this.width;
    animation.spriteHeight = this.height;
    animation.animations =  {
      boom: {
        frameRow: 0,
        frameLength: 5,
      }
    };
    this.add(animation);

    animation.play('boom');
    animation.onFinishOnce(() => {
      this.queueDelete();
    });
    const sound = new Audio();
    sound.src = 'assets/effect/boom.wav';
    sound.play();
  }
}