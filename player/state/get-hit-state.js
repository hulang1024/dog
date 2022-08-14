import Input from '../../input.js';
import { State, StateId } from './state.js';

export class BaseGetHitState extends State {
  constructor(state, player) {
    super(state, player);
    this.animationName = null;
  }

  onEnter() {
    const { player } = this;
    if (player.invincible) {
      this.to(this.prevState.id);
      return;
    }
    if (this.prevState.id == StateId.Running) {
      player.velocity.x = 0;
    }
    player.invincible = true;
    player.animation.play(this.animationName);
    this.camera.lookAt(player);
    const onFinish = () => {
      player.animation.pause();
      player.animation.removeFinishCallback(onFinish);
      if (player.isOnFloor()) {
        this.to(StateId.Standing);
      } else {
        this.to(StateId.Falling);
      }
      setTimeout(() => {
        player.invincible = false;
      }, player.invincibleDuration);
    };
    player.animation.addFinishCallback(onFinish);
  }

  onKeyPressed(key) {
    if (!this.player.invincible) {
      return;
    }
    switch (key) {
      case Input.Keys.Left:
        this.to(StateId.Running, -1);
        break;
      case Input.Keys.Right:
        this.to(StateId.Running, 1);
        break;
      case Input.Keys.Up:
        this.to(StateId.Jumping);
        break;
      case Input.Keys.Down:
        this.to(StateId.Sitting);
        break;
    }
  }
}

export default class GetHitState extends BaseGetHitState {
  constructor(player) {
    super(StateId.GetHit, player);
    this.animationName = 'get_hit';
  }
}