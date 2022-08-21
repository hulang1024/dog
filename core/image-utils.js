import { createCanvas } from "./canvas.js";

const loadedRawImages = {};
const cachedImages = {};

const ImageUtils = {
  getImage(id) {
    return loadedRawImages[id]
       || (loadedRawImages[id] = document.getElementById(id));
  },
  cachedRegion(name, image, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (cachedImages[name]) {
      return cachedImages[name];
    }
    const canvas = createCanvas(dw, dh);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    return cachedImages[name] = canvas;
  },
  cached(name, image, width, height) {
    if (cachedImages[name]) {
      return cachedImages[name];
    }
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0,width, height);
    return cachedImages[name] = canvas;
  },
};

export default ImageUtils;