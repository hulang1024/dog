import { PauseMode, traverseTrees } from './core/node.js';
import { Group } from './core/node.js';
import Background from './background.js';
import Camera2D from './core/camera2d.js';
import Player from './player/player.js';
import Input from './core/input.js';
import { pauseAllSounds, resumeAllSounds, Sound2D } from './core/sound.js';
import HUD from './hud.js';
import { EnemyManager } from './enemies/enemies.js';
import CanvasLayer from './core/canvas-layer.js';
import Viewport from './core/viewport.js';
import { DebugInfoLayer } from './utils.js';
import CanvasItem from './core/canvas-item.js';

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

    this.root = this;

    // (当前场景的)所有节点
    this.nodes  = [];
    // (当前场景的)所有CanvasLayer
    this.canvasLayers = [];

    this.canvasLayer = new CanvasLayer(this, 0, 'default');
    this.add(this.canvasLayer);

    this.camera = new Camera2D(this);
    this.add(this.camera);
    this.camera.setViewport(this);

    this.background = new Background(this);
    this.add(this.background);

    this.player = new Player(this);
    this.particleGroup = new Group();
    this.enemyManager = new EnemyManager(this);

    this.canvasLayer.add(this.enemyManager);
    this.canvasLayer.add(this.particleGroup);
    this.canvasLayer.add(this.player);    
    this.canvasLayer.followViewportEnable = true;

    this.hud = new HUD(this, this);
    this.add(this.hud);
  }

  addNode(node) {
    this.nodes.push(node);
  
    if (node instanceof CanvasLayer) {
      this.canvasLayers.push(node);
    } else {
      // 为直接或间接子级的CanvasItem保存最近的CanvasLayer
      if (!node.canvasLayer) {
        let parent = node.parent;
        if (parent instanceof CanvasLayer) {
          node.canvasLayer = parent;
        } else {
          node.canvasLayer = parent.canvasLayer;
        }
      }
      if (node instanceof CanvasItem) {
        const canvasLayer = node.canvasLayer;
        canvasLayer.canvasItems.push(node);
        node.transform = canvasLayer.viewport.canvasTransform;
        node.context2d = canvasLayer.context2d;
      }
    }
  }

  update(delta) {
    if (this.isGameOver) {
      this.onGameOver();
    }

    if (!this.isPause) {
      this.time += delta;
    }

    this.nodes.forEach((node) => {
      if (!this.isPause || node.isProcessOnPause()) {
        node.update(delta);
      }
    });

    let removeCnt = 0, node;
    for (let i = 0, len = this.nodes.length; i < len; i++) {
      node = this.nodes[i];
      if (node.isQueuedForFree) {
        node.parent.removeChild(node);
        node.exitTree();
        removeCnt++;
      }
    }
    if (removeCnt > 0) {
      this.nodes = this.nodes.filter((node) => !node.isQueuedForFree);
    }
  }

  onGameOver() {
    if (this.isPause) {
      return;
    }
    this.isPause = true;
    pauseAllSounds();
    traverseTrees(this.children, (node) => {
      if (node instanceof Sound2D) {
        node.queueFree();
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
        this._toggleDebugInfoLayer();
        break;
      case Input.Keys.B:
        Game.debugOptions.enableBox = !Game.debugOptions.enableBox;
        break;
      case Input.Keys.I:
        Game.debugOptions.displayStatesInfo =
          !Game.debugOptions.displayStatesInfo;
        this._toggleDebugInfoLayer();
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

  _toggleDebugInfoLayer() {
    if (Game.isDebugMode && Game.debugOptions.displayStatesInfo) {
      this.debugInfoLayer = new DebugInfoLayer(this, this);
      this.add(this.debugInfoLayer);
    } else {
      this.removeChild(this.debugInfoLayer);
    }
  }
}

Game.isDebugMode = true;
Game.debugOptions = {
  displayStatesInfo: false,
  enableBox: false,
  displaySound2DVolume: false
};