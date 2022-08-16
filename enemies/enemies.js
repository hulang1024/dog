import { SmallSpider, BigSpider } from './spider.js';
import Fly from './fly.js';
import Plant from './plant.js';
import { random, randomRange } from '../random.js';
import { Group } from '../game-object.js';

export class EnemyManager extends Group {
  constructor(game) {
    super();
    this.game = game;
    this.player = game.player;
    this.camera = game.camera;
  }

  update(delta) {
    this.children.forEach((enemy) => {
      if (enemy.position.x - this.camera.position.x < -enemy.width) {
        enemy.queueDelete();
      }
    });

    for (let count = 6 - this.count(); count > 0; count--) {
      const rv = Math.floor(randomRange(1, 4));
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
            this.camera.position.x + this.game.viewportWidth);
        }
      } else if (rv == 2) {
        enemy = new Fly(this.game);
      } else if (rv == 3) {
        enemy = new Plant(this.game);
      }
      this.add(enemy);
    }
  }
}