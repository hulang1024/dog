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
    player.animation.onFinishOnce(() => {
      player.animation.pause();
      if (this.game.lives == 0) {
        this.to(StateId.Dead);
      } else {
        if (player.isOnFloor()) {
          this.to(StateId.Standing);
        } else {
          this.to(StateId.Falling);
        }
      }
    });
    setTimeout(() => {
      player.invincible = false;
    }, player.invincibleDuration);
  }
}

export default class GetHitState extends BaseGetHitState {
  constructor(player) {
    super(StateId.GetHit, player);
    this.animationName = 'get_hit';
  }
}