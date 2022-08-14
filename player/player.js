import Game from '../game.js';
import GameObject from '../game-object.js';
import Vector2 from '../vector.js';
import { setupStateTable } from './state/state-table.js';
import { StateId, getState } from './state/state.js';
import { SpriteAnimation } from '../animation.js';
import { checkCollision } from '../collision.js';
import Boom from '../effect.js';
import FloatingText from '../floating-text.js';

export default class Player extends GameObject {
  constructor(game) {
    super();
    this.game = game;
    this.context = game.context;
    this.width = 100;
    this.height = 91.3;
    this.position.x = 0
    this.position.y = this.game.viewportHeight - this.height - this.game.bottomMargin;
    this.velocity = Vector2.Zero();
    this.weight = 120;
    this.invincibleDuration = 200;
    this.invincible = false;

    this.hurtCollisionRect = {
      position: this.position.clone(),
      width: this.width - 32, 
      height: this.height - 20,
    };
    
    this.animation = new SpriteAnimation();
    this.animation.image = document.getElementById('player');
    this.animation.spriteWidth = 100;
    this.animation.spriteHeight = 91.3;
    this.animation.animations = playerAnimations;
    this.add(this.animation);

    setupStateTable(this);
    this.nowState = getState(StateId.Sitting);
    this.nowState.onEnter();
  }

  update(delta) {
    this.nowState.onUpdate(delta);

    this.hurtCollisionRect.position.x = this.position.x + 16;
    this.hurtCollisionRect.position.y = this.position.y + 20;
    const enemy = checkCollision(this.hurtCollisionRect, this.game.enemies);
    if (enemy) {
      enemy.queueDelete();
      if (this.nowState.id == StateId.Rolling ||
          this.nowState.id == StateId.Diving) {
        this.game.score++;
        this.game.add(new FloatingText(
          this.game, '+1', enemy.position,
          new Vector2(180, 40)));
        this.game.add(new Boom(
          enemy.position.x + enemy.width * 0.5,
          enemy.position.y + enemy.height * 0.5));
      } else if (!this.invincible) {
        this.nowState.to(StateId.Dizzy);
        this.game.lives--;
        if (this.game.lives == 0) {
          this.game.gameOver = true;
        }
      }
    }

    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;

    this.applyGravity();

    if (this.position.x < 0) {
      this.position.x = 0;
      this.velocity.x = 0;
    }

    if (!this.game.camera.followTarget &&
        this.velocity.x == 0 && this.velocity.y == 0 &&
        this.position.x > this.game.camera.position.x + this.game.camera.width) {
      this.game.camera.lookAt(this);
    }
  }

  draw(ctx) {
    super.draw(ctx);
    if (Game.isDebugMode && Game.debugOptions.enableBox) {
      ctx.strokeStyle = '#ff0000';
      ctx.strokeRect(
        this.hurtCollisionRect.position.x,
        this.hurtCollisionRect.position.y,
        this.hurtCollisionRect.width, this.hurtCollisionRect.height);
    }
  }

  applyGravity() {
    if (!this.isOnFloor()) {
      this.velocity.y = this.velocity.y + this.weight;
    } else {
      this.velocity.y = 0;
      this.position.y = this.game.viewportHeight - this.height - this.game.bottomMargin;
    }
  }

  onKeyPressed(key) {
    super.onKeyPressed(key);
    this.nowState.onKeyPressed(key);
  }

  onKeyReleased(key) {
    super.onKeyReleased(key);
    this.nowState.onKeyReleased(key);
  }

  isOnFloor() {
    return this.position.y >=
      this.game.viewportHeight - this.height - this.game.bottomMargin;
  }
}

const playerAnimations = {
  idle: {
    frameRow: 0,
    frameLength: 7,
  },
  jump: {
    frameRow: 1,
    frameLength: 7,
  },
  fall: {
    frameRow: 2,
    frameLength: 7,
  },
  run: {
    frameRow: 3,
    frameLength: 9,
  },
  dizzy: {
    frameRow: 4,
    frameLength: 11,
  },
  sit: {
    frameRow: 5,
    frameLength: 5,
  },
  roll: {
    frameRow: 6,
    frameLength: 7,
  },
  bite: {
    frameRow: 7,
    frameLength: 7,
  },
  ko: {
    frameRow: 8,
    frameLength: 12,
  },
  get_hit: {
    frameRow: 9,
    frameLength: 4,
  },
};