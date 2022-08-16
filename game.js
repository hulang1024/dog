import GameObject, { Group } from './game-object.js';
import Background from './background.js';
import Camera from './camera.js';
import Player from './player/player.js';
import Input from './input.js';
import HUD from './hud.js';
import { EnemyManager } from './enemies/enemies.js';

export default class Game extends GameObject {
  constructor(viewportWidth, viewportHeight) {
    super();
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;

    this.theme = Math.random() > 0.5 ? 'city' : 'forest';
    this.bottomMargin = {city: 82, forest: 40}[this.theme];

    this.score = 0;
    this.lives = 5;
    this.time = 0;
    this.isGameOver = false;

    this.camera = new Camera(this);
    this.add(this.camera);

    this.background = new Background(this.camera, this.theme);
    this.add(this.background);

    this.player = new Player(this);
    this.add(this.player);

    this.particleGroup = new Group();
    this.add(this.particleGroup);

    this.enemyManager = new EnemyManager(this);
    this.add(this.enemyManager);

    this.hud = new HUD(this);
    this.add(this.hud);
  }

  update(delta) {
    if (this.isGameOver) {
      return;
    }

    this.time += delta;

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
    this.camera.with(ctx, true, () => {
      traverseTrees(this.children, (node) => {
        node.draw(ctx, delta);
      });
    });
  }

  restart() {
    this.score = 0;
    this.lives = 5;
    this.time = 0;

    this.camera.reset();

    this.particleGroup.clear();
    this.enemyManager.clear();

    this.children = this.children.filter((c) => (
      c instanceof Camera ||
      c instanceof Background ||
      c instanceof HUD ||
      c == this.particleGroup ||
      c == this.enemyManager
    ));

    this.remove(this.player);
    this.player = new Player(this);
    this.add(this.player);

    this.isGameOver = false;
  }

  onKeyPressed(key) {
    super.onKeyPressed(key);
    switch (key) {
      case Input.Keys.Enter:
        if (this.isGameOver) {
          this.restart();
        } else {
          Game.isPause = !Game.isPause;
        }
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