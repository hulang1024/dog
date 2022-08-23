import Node2D from "./node2d.js";
import Vector2 from "./vector.js";

export default class Camera2D extends Node2D {
  constructor() {
    super();
    this.viewport = null;
    this.smoothingEnabled = true;
    this.smoothingSpeed = 60;
    this.offset = Vector2.Zero();
    this.lookAtTarget = null;
    this.followTarget = null;
  }

  setViewport(viewport) {
    this.viewport = viewport;
    this.width = viewport.width;
  }

  changeSpeed(val) {
    if (this.smoothingSpeed != val) {
      console.log('相机速度改变为' + val);
    }
    this.smoothingSpeed = val;
  }

  update(delta) {
    if (this.viewport) {
      this.viewport.canvasTransform.x = -1 * (this.position.x + this.offset.x);
      this.viewport.canvasTransform.y = -1 * (this.position.y + this.offset.y);
    }

    if (this.offset.x < 0) {
      this.offset.x = Math.min(0, this.offset.x + this.smoothingSpeed * delta);
    } else if (this.offset.x > 0) {
      this.offset.x = Math.max(0, this.offset.x - this.smoothingSpeed * delta);
    }
    if (this.offset.y < 0) {
      this.offset.y = Math.min(0, this.offset.y + this.smoothingSpeed * delta);
    } else if (this.offset.y > 0) {
      this.offset.y = Math.max(0, this.offset.y - this.smoothingSpeed * delta);
    }

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
    this.followTarget = target;
  }

  reset() {
    this.followTarget = null;
    this.lookAtTarget = null;
    this.position.set(0, 0);
  }
}