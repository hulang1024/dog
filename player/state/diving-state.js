import { SplashParticle } from '../../particle.js';
import { FireParticlesManager } from '../../particle.js';
import { State, StateId } from './state.js';

export default class DivingState extends State {
  constructor(player) {
    super(StateId.Diving, player);
    this.vMaxSpeed = 1260;
    this.fireParticlesManager = new FireParticlesManager(player);
  }

  onEnter() {
    this.player.velocity.y = Math.sign(this.player.velocity.x) * this.vMaxSpeed;
    this.player.animation.play('roll');
    this.fireParticlesManager.reset();
  }

  onUpdate() {
    const { player } = this;
    if (player.isOnFloor()) {
      for (let i = 0; i < 30; i++) {
        this.player.game.add(
          new SplashParticle(
            this.player.position.x + this.player.width / 2,
            this.player.position.y + this.player.height));
      }
      if (this.player.velocity.x == 0) {
        this.to(StateId.Sitting);
      } else {
        this.to(StateId.Running);
      }
    }

    this.fireParticlesManager.update();
  }
}