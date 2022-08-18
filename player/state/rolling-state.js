import Input from '../../input.js';
import { FireParticlesManager } from '../../effect/particle.js';
import { State, StateId } from './state.js';

export default class RollingState extends State {
  constructor(player) {
    super(StateId.Rolling, player);
    this.hMaxSpeed = 840;
    this.vMaxSpeed = 2200;
    this.fireParticlesManager = new FireParticlesManager(player);
  }

  onEnter() {
    this.camera.changeSpeed(this.hMaxSpeed);
    this.player.velocity.x = Math.sign(this.player.velocity.x || 1) * this.hMaxSpeed;
    this.player.animation.play('roll');
    this.fireParticlesManager.reset();
  }

  onUpdate() {
    const { player } = this;
    if (player.isOnFloor()) {
      if (Input.isPressed(Input.Keys.Space)) {
        if (Input.isPressed(Input.Keys.Up)) {
          player.velocity.y = -this.vMaxSpeed;
        }
      } else {
        this.to(StateId.Running);
      }
    } else if (!Input.isPressed(Input.Keys.Space)) {
      this.to(StateId.Falling);
    }
    
    if (Input.isPressed(Input.Keys.Left)) {
      player.velocity.x = -this.hMaxSpeed;
    } else if (Input.isPressed(Input.Keys.Right)) {
      player.velocity.x = this.hMaxSpeed;
    }

    this.fireParticlesManager.update();
  }

  onKeyPressed(key) {
    if (key == Input.Keys.Down && !this.player.isOnFloor()) {
      this.to(StateId.Diving);
    }
  }
}