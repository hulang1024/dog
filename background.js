import GameObject from "./game-object.js";

export default class Background extends GameObject {
  constructor(camera) {
    super();
    this.width = 1667;
    this.height = 500;

    const theme = 'city';
    for (let l = 0; l < 5; l++) {
      const image = document.getElementById('bg-' +  theme + '-layer-' + (l + 1));
      const t = 0.2 * (l + 1);
      this.add(new Layer(this.width, this.height, image, camera, t));
    }
  }
}

class Layer extends GameObject {
  constructor(width, height, image, camera, speedModifier) {
    super();
    this.offsetX = 0;
    this.offsetY = 0;
    this.width = width;
    this.height = height;
    this.image = image;
    this.camera = camera;
    this.speedModifier = speedModifier;
  }

  update() {
    this.offsetX = -this.camera.position.x * this.speedModifier % this.width;
  }

  draw(ctx) {
    ctx.save();
    // 消除相机translate
    ctx.translate(this.camera.position.x, this.camera.position.y);

    ctx.drawImage(this.image, this.offsetX, this.offsetY,
      this.width, this.height);
    ctx.drawImage(this.image, this.offsetX + this.width, this.offsetY,
      this.width, this.height);

    ctx.restore();
  }
}
