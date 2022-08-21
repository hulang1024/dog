import { PauseMode, traverseTrees } from './core/node.js';
import { Group } from './core/node.js';
import Background from './background.js';
import Camera from './core/camera.js';
import Player from './player/player.js';
import Input from './core/input.js';
import { pauseAllSounds, resumeAllSounds, Sound2D } from './core/sound.js';
import HUD from './hud.js';
import { EnemyManager } from './enemies/enemies.js';
import CanvasLayer from './core/canvas-layer.js';
import Viewport from './core/viewport.js';
import { drawDebugInfo } from './utils.js';

export default class Game extends Viewport {
  constructor() {
    super(900, 500);
    this.score = 0;
    this.maxLives = 5;
    this.lives = this.maxLives;
    this.time = 0;
    this.isPause = true;
    this.isGameOver = false;
    this.setPauseMode(PauseMode.Stop);

    this.camera = new Camera(this);
    this.add(this.camera);
    this.camera.setViewport(this);

    this.background = new Background(this);
    this.add(this.background);

    this.player = new Player(this);
    this.particleGroup = new Group();
    this.enemyManager = new EnemyManager(this);

    this.canvasLayer = new CanvasLayer(this, 0, 'default');
    this.canvasLayer.add(this.enemyManager);
    this.canvasLayer.add(this.particleGroup);
    this.canvasLayer.add(this.player);    
    this.canvasLayer.followViewportEnable = true;
    this.add(this.canvasLayer);

    this.hud = new HUD(this, this);
    this.add(this.hud);

    this.debugCanvasLayer = new CanvasLayer(this, 2, 'debug');
    this.add(this.debugCanvasLayer);
  }

  update(delta) {
    if (Game.isDebugMode && Game.debugOptions.displayStatesInfo) {
      drawDebugInfo(this, delta);
    }
    
    if (this.isGameOver) {
      this.onGameOver();
    }

    if (!this.isPause) {
      this.time += delta;
    }

    traverseTrees(this.children, (node) => {
      if (!this.isPause || node.isProcessOnPause()) {
        node.update(delta);
      }
      return true;
    });
    traverseTrees(this.children, (node) => {
      if (node.isQueuedForFree) {
        node.parent.removeChild(node);
        return false;
      }
      return true;
    });
  }

  onGameOver() {
    if (this.isPause) {
      return;
    }
    this.isPause = true;
    pauseAllSounds();
    traverseTrees(this.children, (node) => {
      if (node instanceof Sound2D) {
        node.exitTree();
      }
      return true;
    });
  }

  restart() {
    this.score = 0;
    this.lives = this.maxLives;
    this.time = 0;

    this.camera.reset();

    this.particleGroup.clear();
    this.enemyManager.clear();

    this.canvasLayer.removeChild(this.player);
    this.player = new Player(this);
    this.canvasLayer.add(this.player);

    this.isGameOver = false;
    this.isPause = false;
  }

  onKeyPressed(key) {
    super.onKeyPressed(key);
    switch (key) {
      case Input.Keys.Enter:
        if (this.isGameOver) {
          this.restart();
        } else {
          this.isPause = !this.isPause;
          if (this.isPause) {
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

Game.isDebugMode = true;
Game.debugOptions = {
  displayStatesInfo: false,
  enableBox: false,
  displaySound2DVolume: false
};