export function createCanvas(width, height, id, pixelScale = true) {
  const canvas = document.createElement('canvas');
  if (id) {
    canvas.id = id;
  }
  const ctx = canvas.getContext('2d');
  const pixelRatio = pixelScale ? (() => {
    const backingStore = ctx.backingStorePixelRatio ||
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  })() : 1;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  if (pixelRatio != 1) {
  ctx.scale(pixelRatio, pixelRatio);
  }
  return canvas;
}