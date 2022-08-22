import Node2D from "../core/node2d.js";
import { randomRange } from "../core/random.js";
import Vector2 from "../core/vector.js";
import ImageUtils from "../core/image-utils.js";
import { PauseMode } from "../core/node.js";

export class Particle extends Node2D {
  constructor() {
    super();
    this.setPauseMode(PauseMode.Stop);
    this.velocity = null;
  }

  update(delta) {
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
  }
}

export class DustParticle extends Particle {
  constructor(x, y) {
    super();
    this.position.set(x, y);
    this.velocity = new Vector2(-randomRange(0, 62), -randomRange(0, 62));
    this.size = randomRange(10, 20);
  }

  update(delta) {
    super.update(delta);
    this.size *= 0.95;
    if (this.size < 0.5) {
      this.queueFree();
    }
  }

  draw() {
    this.drawArc(this.position,
      this.size, 0, Math.PI * 2, 'rgba(10, 10, 10, 0.3)');
  }
}

export class FireParticle extends Particle {
  constructor(x, y) {
    super();
    this.position.set(x, y);
    this.velocity = new Vector2(-1 * 62, -1 * 62);
    this.size = randomRange(90, 100);
    this.image = ImageUtils.cached('fire', ImageUtils.getImage('fire'), 100, 90);
    this.va = randomRange(-1, 1) * 62;
    this.angle = 0;
  }

  update(delta) {
    super.update(delta);
    this.angle += this.va * delta;
    this.position.x += Math.sin(this.angle * (310 * delta));
    this.size *= 0.95;
    if (this.size < 0.5) {
      this.queueFree();
    }
  }

  draw() {
    // tood: 不用translate
    this.context2d.save();
    const transform = this.transform;
    this.context2d.translate(this.position.x + transform.x, this.position.y + transform.y);
    this.context2d.rotate(this.angle);
    this.context2d.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
    this.context2d.restore();
  }
}

export class SplashParticle extends Particle {
  constructor(x, y) {
    super();
    this.size = randomRange(100, 200);
    this.position.x = x - this.size * 0.4;
    this.position.y = y - this.size * 0.5;
    this.velocity = new Vector2(randomRange(-4, 4) * 62, -randomRange(1, 3) * 62);
    this.image = ImageUtils.getImage('fire');
    this.gravity = 0;
  }

  update(delta) {
    super.update(delta);
    this.gravity += 0.1;
    this.position.y += this.gravity;
    this.size *= 0.95;
    if (this.size < 0.5) {
      this.queueFree();
    }
  }

  draw() {
    this.drawImage(this.image, this.position.x, this.position.y, this.size, this.size);
  }
}

export class FireParticlesManager {
  constructor(player) {
    this.player = player;
    this.game = player.game;
    this.particleCount = 0;
  }

  update() {
    if (this.particleCount < 300) {
      const particle = new FireParticle(
        this.player.position.x + this.player.width * 0.5,
        this.player.position.y + this.player.height * 0.5);
      this.game.particleGroup.add(particle);
    }
  }

  reset() {
    this.particleCount = 0;
  }
}