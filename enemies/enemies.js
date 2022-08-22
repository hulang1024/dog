import { Group, PauseMode } from '../core/node.js';
import { SmallSpider, BigSpider } from './spider.js';
import Fly from './fly.js';
import Plant from './plant.js';
import Zombie from './zombie.js';
import Worm from './worm.js';
import Hand from './hand.js';
import { Bat1, Bat2 } from './bat.js';
import Bat3 from './bat3.js';
import Ghost1 from './ghost1.js';
import Razor from './Razor.js';
import { random, randomRange } from '../core/random.js';

export class EnemyManager extends Group {
  constructor(game) {
    super();
    this.setPauseMode(PauseMode.Stop);
    this.game = game;
    this.player = game.player;
    this.camera = game.camera;
  }

  update() {
    for (let count = 11 - this.count(); count > 0; count--) {
      const rv = Math.floor(randomRange(1, 11));
      let enemy;
      if (rv == 1) {
        enemy = random() > 0.5
          ? new BigSpider(this.game)
          : new SmallSpider(this.game);
        if (random() > 0.5) {
          enemy.position.x = randomRange(
            this.camera.position.x, this.player.position.x);
        } else {
          enemy.position.x = randomRange(
            this.player.position.x,
            this.camera.position.x + this.game.width);
        }
      } else if (rv == 2) {
        enemy = new Fly(this.game);
      } else if (rv == 3) {
        enemy = new Plant(this.game);
      } else if (rv == 4) {
        enemy = new Zombie(this.game);
      } else if (rv == 5) {
        enemy = new Worm(this.game);
      } else if (rv == 6) {
        enemy = random() > 0.5
          ? new Bat1(this.game)
          : new Bat2(this.game)
      } else if (rv == 7) {
        enemy = new Bat3(this.game)
      } else if (rv == 8) {
        enemy = new Ghost1(this.game)
      } else if (rv == 9) {
        enemy = new Razor(this.game)
      } else {
        enemy = new Hand(this.game);
      }
      this.add(enemy);
    }
  }
}