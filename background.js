import CanvasLayer from "./core/canvas-layer.js";
import ImageUtils from "./core/image-utils.js";
import { PauseMode } from "./core/node.js";
import Node2D from "./core/node2d.js";
import Vector2 from "./core/vector.js";
import { random } from "./core/random.js";

export default class Background extends CanvasLayer {
  constructor(viewport) {
    super(viewport, -1, 'background');
    this.setPauseMode(PauseMode.Process);
    this.scrollOffset = this.viewport.canvasTransform;
    this.theme = random() > 0.5 ? 'city' : 'forest';
    this.floorY = viewport.height - {city: 82, forest: 40}[this.theme];
  }

  enterTree() {
    super.enterTree();
    const width = 1667;
    const height = 500;
    for (let l = 0; l < 5; l++) {
      const id = 'bg-' +  this.theme + '-layer-' + (l + 1);
      const image = ImageUtils.getImage(id);
      const layer = new ParallaxLayer(this.viewport, width, height, id, image);
      this.add(layer);
    }
  }

  update() {
    this.context2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let layer;
    for (let l = 0, len = this.children.length; l < len; l++) {
      layer = this.children[l];
      layer.motionOffset.x = this.scrollOffset.x * 0.2 * (l + 1) - this.scrollOffset.x;
      layer.draw();
    }
  }
}

class ParallaxLayer extends Node2D {
  constructor(viewport, width, height, id, rawImage) {
    super();
    this.viewport = viewport;
    const extendY = 8; // 多余高度，以支持相机晃动效果
    this.width = width;
    this.height = height + extendY;
    this.motionOffset = new Vector2(0, -extendY);
    this.image = ImageUtils.cached(id, rawImage, width, height + extendY);
    this.copyImage = ImageUtils.cachedRegion(id + '_copy', rawImage,
      0, 0, this.viewport.width, height,
      0, 0, this.viewport.width, height + extendY);
  }

  ready() {
    this.update();
  }

  update() {
    this.position.x = (0.5 +
      ((this.parent.scrollOffset.x + this.motionOffset.x) % this.width)) << 0;
    this.position.y = (0.5 +
      (this.parent.scrollOffset.y + this.motionOffset.y)) << 0;
  }

  draw() {
    this.context2d.drawImage(this.image,
      this.position.x, this.position.y,
      this.width, this.height);
    if (this.position.x <= this.viewport.width - this.width) {
      this.context2d.drawImage(this.copyImage,
        this.position.x + this.width, this.position.y,
        this.viewport.width, this.height);
    }
  }
}
