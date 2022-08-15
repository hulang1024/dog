import Input from '../../input.js';
import { DustParticle } from '../../effect/particle.js';
import { State, StateId } from './state.js';

export default class RunningState extends State {
  constructor(player) {
    super(StateId.Running, player);
    this.runSpeed = 420;
  }

  onEnter(dir) {
    dir = dir || Math.sign(this.player.velocity.x) || 1;
    this.camera.changeSpeed(this.runSpeed);
    this.camera.follow(this.player);
    this.player.animation.play('run');
    this.player.velocity.x = dir * this.runSpeed;
  }

  onUpdate() {
    const dust = new DustParticle(
      this.player.position.x + this.player.width * 0.5,
      this.player.position.y + this.player.height);
    this.game.particleGroup.add(dust);
  }

  onKeyPressed(key) {
    switch (key) {
      case Input.Keys.Left:
        this.player.velocity.x = -this.runSpeed;
        break;
      case Input.Keys.Right:
        this.player.velocity.x = this.runSpeed;
        break;
      case Input.Keys.Up:
        this.to(StateId.Jumping);
        break;
      case Input.Keys.Down:
        this.to(StateId.Sitting);
        break;
      case Input.Keys.Space:
        this.to(StateId.Rolling);
        break;
    }
  }
}