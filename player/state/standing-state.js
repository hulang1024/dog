import Input from '../../input.js';
import { State, StateId } from './state.js';

export default class StandingState extends State {
  constructor(player) {
    super(StateId.Standing, player);
  }

  onEnter() {
    const { player } = this;
    player.animation.play('idle');
    player.velocity.x = 0;
    player.velocity.y = 0;
  }

  onKeyPressed(key) {
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