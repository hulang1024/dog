import { State, StateId } from './state.js';

export default class DeadState extends State {
  constructor(player) {
    super(StateId.Dead, player);
  }

  onEnter() {
    const { player } = this;
    if (this.prevState.id == StateId.Running) {
      player.velocity.x = 0;
    }

    player.animation.play('die');
    player.animation.onFinishOnce(() => {
      player.animation.pause();
      setTimeout(() => {
        this.game.isGameOver = true;
      }, 50);
    });
  }
}