import Game from '../game.js';
import Node2D from '../core/node2d.js';
import Vector2 from '../core/vector.js';
import { setupStateTable } from './state/state-table.js';
import { StateId, getState } from './state/state.js';
import { SpriteAnimation } from '../animation.js';
import { checkCollision } from '../core/collision.js';
import Boom from '../effect/boom.js';
import FloatingText from '../effect/floating-text.js';
import ImageUtils from '../core/image-utils.js';
import { PauseMode } from '../core/node.js';

export default class Player extends Node2D {
  constructor(game) {
    super();
    this.setPauseMode(PauseMode.Stop);
    this.game = game;
    this.context = game.context;
    this.width = 100;
    this.height = 91.3;
    this.position.x = 0
    this.position.y = this.game.height - this.height - this.game.background.bottomMargin;
    this.velocity = Vector2.Zero();
    this.weight = 120;
    // 无敌时长（应大于受击或眩晕的动画时长）
    this.invincibleDuration = 1800;
    this.invincible = false;
    this.shadow = false;

    this.hurtCollisionRect = {
      position: this.position.clone(),
      width: this.width - 32, 
      height: this.height - 20,
    };
    
    this.animation = new SpriteAnimation('player_black');
    this.animation.spriteSheetImage = ImageUtils.getImage('player-black');
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

    this.hurtCollisionRect.position.set(this.position.x + 16, this.position.y + 20);
    const enemies = !this.shadow && checkCollision(
      this.hurtCollisionRect, this.game.enemyManager.children);
    if (enemies.length) {
      if (this.nowState.id == StateId.Rolling ||
          this.nowState.id == StateId.Diving) {
        enemies.forEach((enemy) => {
          if (!enemy.getTransform()) {
            return;
          }
          this.game.score++;
          const enemyScreenPos = enemy.position.plus(enemy.getTransform());
          this.game.hud.add(new FloatingText(
            '+' + enemy.score, 26, enemyScreenPos, new Vector2(180, 40)));
          
          this.game.canvasLayer.add(new Boom(
            enemy.position.x + enemy.width * 0.5,
            enemy.position.y + enemy.height * 0.5));
          enemy.queueFree();
        });
      } else if (!this.invincible) {
        if (this.game.lives > 0) {          
          this.game.lives--;
          this.nowState.to(StateId.Dizzy);
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

  draw() {
    super.draw();
    if (Game.isDebugMode && Game.debugOptions.enableBox) {
      this.drawRect(
        this.hurtCollisionRect.position.x,
        this.hurtCollisionRect.position.y,
        this.hurtCollisionRect.width, this.hurtCollisionRect.height, '#ff0000');
    }
  }

  applyGravity() {
    if (!this.isOnFloor()) {
      this.velocity.y = this.velocity.y + this.weight;
    } else {
      this.velocity.y = 0;
      this.position.y = this.game.height - this.height - this.game.background.bottomMargin;
    }
  }

  onKeyPressed(key) {
    if (!this.game.isPause) {
      this.nowState.onKeyPressed(key);
    }
  }

  onKeyReleased(key) {
    if (!this.game.isPause) {
      this.nowState.onKeyReleased(key);
    }
  }

  isOnFloor() {
    return this.position.y >=
      this.game.height - this.height - this.game.background.bottomMargin;
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
  die: {
    frameRow: 8,
    frameLength: 12,
  },
  get_hit: {
    frameRow: 9,
    frameLength: 4,
  },
};