import { SpriteAnimation } from "../animation.js";
import { Sound2D } from "../sound.js";
import Vector2 from "../vector.js";
import { randomRange } from "../random.js";
import Enemy from "./enemy.js";

export class BaseSpider extends Enemy {
  constructor(game, score, ageMax) {
    super(game, score);
    this.position.y = -this.height + randomRange(0, 10);
    this.silkYOffset = 0;
    this.slikWidth = 1;
    this.age = 0;
    this.ageMax = ageMax;
    this.sound = new Sound2D('assets/sounds/spider_chattering.wav', this.game);
    this.sound.audio.loop = true;
    this.sound.play();
    this.add(this.sound);
  }

  update(delta) {
    super.update(delta);

    this.position.y += this.velocity.y * delta;
    if (this.velocity.y > 0) {
      const bottom = this.game.viewportHeight - this.game.bottomMargin - 4;
      if (this.position.y + this.height > bottom) {
        this.position.y = bottom - this.height;
        this.velocity.y = -this.velocity.y;
      }
    } else {
      if (this.position.y < -this.height) {
        this.position.y = -this.height;
        this.velocity.y = -this.velocity.y;
        this.age++;
        if (this.age >= this.ageMax) {
          this.queueDelete();
        }
      }
    }
  }

  draw(ctx) {
    super.draw(ctx);
    const cx = this.position.x + this.width / 2;
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = this.slikWidth;
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, this.position.y + this.silkYOffset);
    ctx.stroke();
  }
}

export class SmallSpider extends BaseSpider {
  constructor(game) {
    super(game, 2, 3);
    this.width = 100;
    this.height = 56;
    this.velocity = new Vector2(0, randomRange(100, 180));
    this.silkYOffset = 4;
    this.slikWidth = 1;
    this.sound.volumeFactor = 0.02;

    const animation = new SpriteAnimation();
    animation.image = document.getElementById('enemy-spider');
    animation.spriteWidth = 310;
    animation.spriteHeight = 175;
    animation.animations =  {
      move: {
        frameRow: 0,
        frameLength: 6,
      }
    };
    this.add(animation);

    animation.play('move');
  }
}

export class BigSpider extends BaseSpider {
  constructor(game) {
    super(game, 1, 2);
    this.width = 120;
    this.height = 144;
    this.velocity = new Vector2(0, randomRange(30, 160));
    this.silkYOffset = 44;
    this.slikWidth = 1.5;
    this.sound.volumeFactor = 0.04;

    const animation = new SpriteAnimation();
    animation.image = document.getElementById('enemy-spider-big');
    animation.spriteWidth = this.width;
    animation.spriteHeight = this.height;
    animation.animations =  {
      move: {
        frameRow: 0,
        frameLength: 6,
      }
    };
    animation.intervelFps = 16;
    this.add(animation);

    animation.play('move');
  }
}