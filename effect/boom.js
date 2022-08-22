import Node2D from "../core/node2d.js";
import { SpriteAnimation } from "../animation.js";
import ImageUtils from "../core/image-utils.js";

export default class Boom extends Node2D {
  constructor(x, y) {
    super();
    this.width = 100;
    this.height = 90;
    this.position.set(x, y);
  }

  enterTree() {
    const animation = new SpriteAnimation('boom');
    animation.spriteSheetImage = ImageUtils.getImage('boom');
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
      this.queueFree();
    });
    /*
    const sound = new Audio();
    sound.src = 'assets/sounds/boom.wav';
    sound.volume = 0.05;
    sound.play();
    */
  }
}