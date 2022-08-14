import Input from '../../input.js';
import { State, StateId } from './state.js';

export default class SittingState extends State {
  constructor(player) {
    super(StateId.Sitting, player);
  }

  onEnter() {
    const { player } = this;
    player.animation.play('sit');
    player.velocity.x = 0;
    player.velocity.y = 0;
  }

  onKeyPressed(key) {
    switch (key) {
      case Input.Keys.Up:
        this.to(StateId.Standing);
        break;
      case Input.Keys.Left:
        this.to(StateId.Running, -1);
        break;
      case Input.Keys.Right:
        this.to(StateId.Running, 1);
        break;
      case Input.Keys.Space:
        this.to(StateId.Rolling);
        break;
    }
  }
}