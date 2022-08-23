import Input from '../../core/input.js';
import { State, StateId } from './state.js';

export default class JumpingState extends State {
  constructor(player) {
    super(StateId.Jumping, player);
    this.maxSpeed = 2200;
  }

  onEnter() {
    this.player.animation.play('jump');
    this.player.velocity.y = -this.maxSpeed;
  }

  onUpdate(_, Input) {
    const { player } = this;
    if (Input.isPressed(Input.Keys.Left)) {
      player.velocity.x = -360;
    } else if (Input.isPressed(Input.Keys.Right)) {
      player.velocity.x = 360;
    }
  
    if (!Input.isPressed(Input.Keys.Up)) {
      player.velocity.y += player.weight;
    }
    if (player.velocity.y > player.weight) {
      this.to(StateId.Falling);
    }
  }

  onKeyPressed(key) {
    if (key == Input.Keys.Down) {
      this.to(StateId.Diving);
    }
  }
}