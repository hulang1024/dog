import Input from '../../input.js';
import { State, StateId } from './state.js';

export default class FallingState extends State {
  constructor(player) {
    super(StateId.Falling, player);
  }

  onEnter() {
    this.player.animation.play('fall');
    this.player.velocity.y = 0;
  }

  onUpdate() {
    if (this.player.isOnFloor()) {
      if (this.prevState.prevState.id == StateId.Running) {
        this.to(StateId.Running, 1);
      } else {
        this.to(StateId.Standing);
      }
    }
  }

  onKeyPressed(key) {
    if (key == Input.Keys.Down) {
      this.to(StateId.Diving);
    }
  }
}