import GameObject from "../game-object.js";
import { randomRange } from "../random.js";
import Vector2 from "../vector.js";

export class Particle extends GameObject {
  constructor() {
    super();
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
    this.position.x = x;
    this.position.y = y;
    this.velocity = new Vector2(-randomRange(0, 62), -randomRange(0, 62));
    this.size = randomRange(10, 20);
  }

  update(delta) {
    super.update(delta);

    this.size *= 0.95;
    if (this.size < 0.5) {
      this.queueDelete();
    }
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(10, 10, 10, 0.3)';
    ctx.fill();
  }
}

export class FireParticle extends Particle {
  constructor(x, y) {
    super();
    this.position.x = x;
    this.position.y = y;
    this.velocity = new Vector2(-1 * 62, -1 * 62);
    this.size = randomRange(90, 120);
    this.image = document.getElementById('fire');
    this.va = randomRange(-1, 1) * 62;
    this.angle = 0;
  }

  update(delta) {
    super.update(delta);
    this.angle += this.va * delta;
    this.position.x += Math.sin(this.angle * (310 * delta));
    this.size *= 0.95;
    if (this.size < 0.5) {
      this.queueDelete();
    }
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
    ctx.restore();
  }
}

export class SplashParticle extends Particle {
  constructor(x, y) {
    super();
    this.size = randomRange(100, 200);
    this.position.x = x - this.size * 0.4;
    this.position.y = y - this.size * 0.5;
    this.velocity = new Vector2(randomRange(-4, 4) * 62, -randomRange(1, 3) * 62);
    this.image = document.getElementById('fire');
    this.gravity = 0;
  }

  update(delta) {
    super.update(delta);
    this.gravity += 0.1;
    this.position.y += this.gravity;
    this.size *= 0.95;
    if (this.size < 0.5) {
      this.queueDelete();
    }
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.drawImage(this.image, this.position.x, this.position.y, this.size, this.size);
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