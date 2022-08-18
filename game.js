import GameObject, { Group } from './game-object.js';
import Background from './background.js';
import Camera from './camera.js';
import Player from './player/player.js';
import Input from './input.js';
import { pauseAllSounds, resumeAllSounds, Sound2D } from './sound.js';
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
    this.player = new Player(this);
    this.particleGroup = new Group();
    this.enemyManager = new EnemyManager(this);
    this.hud = new HUD(this);

    this.add(this.background);
    this.add(this.enemyManager);
    this.add(this.particleGroup);
    this.add(this.player);
    this.add(this.hud);

    this.camera.follow(this.player);
  }

  update(delta) {
    if (this.isGameOver) {
      this.onGameOver();
      return;
    }

    this.time += delta;

    traverseTrees(this.children, (node) => {
      node.update(delta);
    });

    traverseTrees(this.children, (node) => {
      if (node.isQueuedForDelete) {
        node.parent.deleteChild(node);
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

  onGameOver() {
    pauseAllSounds();
    traverseTrees(this.children, (node) => {
      if (node instanceof Sound2D) {
        node.delete();
      }
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

    this.deleteChild(this.player);
    this.player = new Player(this);
    this.add(this.player);

    this.camera.follow(this.player);

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
          if (Game.isPause) {
            pauseAllSounds();
          } else {
            resumeAllSounds();
          }
        }
        break;
      case Input.Keys.D:
        Game.isDebugMode = !Game.isDebugMode;
        break;
      case Input.Keys.B:
        Game.debugOptions.enableBox = !Game.debugOptions.enableBox;
        break;
      case Input.Keys.I:
        Game.debugOptions.displayStatesInfo =
          !Game.debugOptions.displayStatesInfo;
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
        case Input.Keys.Num7:
          if (Game.isDebugMode) {
            this.player.shadow = !this.player.shadow;
          }
          break;
      case Input.Keys.Num8:
        if (Game.isDebugMode) {
          this.player.invincible = !this.player.invincible;
        }
        break;
      case Input.Keys.Num9:
        Game.debugOptions.displaySound2DVolume =
          !Game.debugOptions.displaySound2DVolume;
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
  displayStatesInfo: false,
  enableBox: false,
  displaySound2DVolume: false
};
Game.isPause = true;