import GameObject from "./game-object.js";

export default class Background extends GameObject {
  constructor(camera, theme) {
    super();
    this.width = 1667;
    this.height = 500;

    for (let l = 0; l < 5; l++) {
      const image = document.getElementById('bg-' +  theme + '-layer-' + (l + 1));
      const t = 0.2 * (l + 1);
      this.add(new Layer(this.width, this.height, image, camera, t));
    }
  }
}

const offsetY = 8; // 多一些高度，以支持相机晃动效果

class Layer extends GameObject {
  constructor(width, height, image, camera, speedModifier) {
    super();
    this.width = width;
    this.height = height;
    this.image = image;
    this.camera = camera;
    this.speedModifier = speedModifier;
  }

  update() {
    this.position.x = (-this.camera.position.x - this.camera.offset.x)
      * this.speedModifier % this.width;
  }

  draw(ctx) {
    this.camera.with(ctx, false, () => {
      ctx.drawImage(this.image,
        this.position.x,
        -this.camera.position.y - this.camera.offset.y - offsetY,
        this.width, this.height + offsetY);
      ctx.drawImage(this.image,
        this.position.x + this.width,
        -this.camera.position.y - this.camera.offset.y - offsetY,
        this.width, this.height + offsetY);
    });
  }
}
