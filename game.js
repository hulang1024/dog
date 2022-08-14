import GameObject from './game-object.js';
import Background from './background.js';
import Camera from './camera.js';
import Player from './player/player.js';
import Input from './input.js';
import { SmallSpider, BigSpider } from './enemies/spider.js';
import Fly from './enemies/fly.js';
import Plant from './enemies/plant.js';
import { randomRange } from './random.js';

export default class Game extends GameObject {
  constructor(viewportWidth, viewportHeight) {
    super();
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.bottomMargin = 82;

    this.score = 0;

    this.camera = new Camera(this);
    this.add(this.camera);

    this.background = new Background(this.camera);
    this.add(this.background);

    this.player = new Player(this);
    this.add(this.player);

    this.enemies = [];
  }

  update(delta) {
    this.enemies.forEach((enemy, i) => {
      if (enemy.isQueuedForDelete) {
        this.enemies.splice(i, 1);
      } else if (enemy.position.x - this.camera.position.x < -enemy.width) {
        this.enemies.splice(i, 1);
        enemy.queueDelete();
      }
    });
    for (let count = 10 - this.enemies.length; count > 0; count--) {
      const rv = Math.floor(randomRange(1, 5));
      let enemy;
      if (rv == 1) {
        enemy = new BigSpider(this);
      } else if (rv == 2) {
        enemy = new SmallSpider(this);
      } else if (rv == 3) {
        enemy = new Fly(this);
      } else if (rv == 4) {
        enemy = new Plant(this);
      }
      this.enemies.push(enemy);
      this.add(enemy);
    }

    traverseTrees(this.children, (node) => {
      node.update(delta);
    });

    traverseTrees(this.children, (node) => {
      if (node.isQueuedForDelete) {
        node.parent.remove(node);
      }
    });
  }

  draw(ctx, delta) {
    this.camera.with(ctx, () => {
      traverseTrees(this.children, (node) => {
        node.draw(ctx, delta);
      });
    });
  }

  onKeyPressed(key) {
    super.onKeyPressed(key);
    switch (key) {
      case Input.Keys.Enter:
        Game.isPause = !Game.isPause;
        break;
      case Input.Keys.D:
        Game.isDebugMode = !Game.isDebugMode;
        break;
      case Input.Keys.B:
        Game.debugOptions.enableBox = !Game.debugOptions.enableBox;
        break;
      case Input.Keys.I:
        Game.debugOptions.displayStatesInfo = !Game.debugOptions.displayStatesInfo;
        break;
      case Input.Keys.P:
        this.camera.position.x += 10;
        break;
      case Input.Keys.O:
        this.camera.position.x -= 10;
        break;
      case Input.Keys.Num1:
        this.camera.smoothingEnabled = !this.camera.smoothingEnabled;
        console.log((this.camera.smoothingEnabled ? '启用' : '禁用') + '相机平滑移动到目标');
        break;
      case Input.Keys.Num2:
        this.camera.lookAt(this.player);
        break;
      case Input.Keys.Num3:
        this.camera.follow(
          this.camera.followTarget == this.player ? null : this.player);
        break;
    }
  }
}

function traverseTrees(nodes, visit) {
  nodes.forEach((node) => {
    visit(node);
    traverseTrees(node.children, visit);
  });
}

Game.isDebugMode = true;
Game.debugOptions = {
  displayStatesInfo: true,
  enableBox: false,
};
Game.isPause = false;