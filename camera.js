import GameObject from "./game-object.js";

export default class Camera extends GameObject {
  constructor(game) {
    super();
    this.position.x = 0;
    this.position.y = 0;
    this.width = game.viewportWidth;
    this.game = game;
    this.smoothingEnabled = true;
    this.smoothingSpeed = 100;
    this.lookAtTarget = null;
    this.followTarget = null;
  }

  changeSpeed(val) {
    if (this.smoothingSpeed != val) {
      console.log('相机速度改变为' + val);
    }
    this.smoothingSpeed = val;
  }

  update(delta) {
    const target = this.lookAtTarget || this.followTarget;
    if (!target) {
      return;
    }
    // 是否在中心的左边
    if (target.position.x > this.position.x &&
        target.position.x + target.width / 2 - this.position.x < this.width / 2) {
      // 不移动
      return;
    }
    // 移到target中心
    // 计算目标位置
    let targetX = target.position.x - (this.width - target.width) / 2;
    if (targetX < 0) {
      targetX = 0;
    }
    if (this.smoothingEnabled) {
      const vx = Math.sign(targetX - this.position.x);
      if (vx != 0) {
        this.position.x += vx * delta * this.smoothingSpeed;
        if (vx > 0 ? this.position.x > targetX : this.position.x < targetX) {
          this.position.x = targetX;
        }
      }
    } else {
      this.position.x = targetX;
    }
    
    if (this.position.x == targetX) {
      if (this.lookAtTarget) {
        console.log('相机已看向 ' + target.constructor.name);
        this.lookAtTarget = null;
      }
    }
  }

  lookAt(target) {
    if (target != this.lookAtTarget) {
      console.log('相机看向 ' + target.constructor.name);
    }
    this.followTarget = null;
    this.lookAtTarget = target;
  }

  follow(target) {
    if (target != this.followTarget) {
      if (target) {
        console.log('相机跟随 ' + target.constructor.name);
      } else {
        console.log('相机取消跟随对象');
      }
    }
    this.lookAtTarget = null;
    this.followTarget = target;
  }

  reset() {
    this.followTarget = null;
    this.lookAtTarget = null;
    this.position.x = 0;
    this.position.y = 0;
  }

  with(ctx, isWith, draw) {
    ctx.save();
    ctx.translate(
      (isWith ? -1 : 1) * this.position.x,
      (isWith ? -1 : 1) * this.position.y);
    draw(ctx);
    ctx.restore();
  }
}