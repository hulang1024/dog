import Input from "./core/input.js";

const BASE_X = 160;
const BASE_Y = 28;

export function drawDebugInfo(game, delta) {
  const { player, camera } = game;
  let y = BASE_Y;
  let newLine = () => y += 20;

  const context2d = game.debugCanvasLayer.context2d;
  context2d.clearRect(BASE_X - 4, BASE_Y - 20, 300, 250);
  context2d.font = '14px monospace';
  if (game.background.theme == 'forest') {
    context2d.fillStyle = 'rgba(255, 255, 255, 0.6)';
  }
  context2d.fillText('camera.position: ' + camera.position, BASE_X, BASE_Y);
  context2d.fillText('camera.offset: ' + camera.offset, BASE_X, newLine());
  context2d.fillText('camera.smoothingEnabled: ' + camera.smoothingEnabled, BASE_X, newLine());
  context2d.fillText('camera.smoothingSpeed:   ' + camera.smoothingSpeed, BASE_X, newLine());
  context2d.fillText('camera.followTarget:     '
    + (camera.followTarget ? camera.followTarget.constructor.name : null), BASE_X, newLine());
  context2d.fillText('camera.lookAtTarget:     '
    + (camera.lookAtTarget ? camera.lookAtTarget.constructor.name : null), BASE_X, newLine());
  context2d.fillText('object count:   ' + countObject(game), BASE_X, newLine());
  context2d.fillText('enemy count:    ' + game.enemyManager.count(), BASE_X, newLine());
  context2d.fillText('particle count: ' + game.particleGroup.count(), BASE_X, newLine());
  context2d.fillText('player.velocity:  ' + player.velocity, BASE_X, newLine());
  context2d.fillText('player.position:  ' + player.position, BASE_X, newLine());
  context2d.fillText('player.state:     ' + player.nowState.id, BASE_X, newLine());

  context2d.clearRect(game.width - 168, BASE_Y - 20, 300, 160);
  y = BASE_Y;
  const fps = Math.round(1 / delta);
  context2d.fillText('FPS:   ' + fps, game.width - 128, BASE_Y);
  context2d.fillText('Delta: ' + delta.toFixed(6), game.width - 128, newLine());

  context2d.fillText('Input.pressedKeys:', game.width - 158, newLine());
  Input.getPressedKeys().forEach((key) => {
    context2d.fillText(key, game.width - 70, newLine());
  });
}

function countObject(node) {
  let cnt = node.children.length;
  node.children.forEach((child) => {
    cnt += countObject(child);
  });
  return cnt;
}

export function parseSearchParams() {
  if (!location.search) {
    return {};
  }
  const pairs = location.search.substring(1).split('&');
  return pairs.reduce((obj, pair) => {
    const [ k, v ] = pair.split('=');
    obj[k] = v;
    return obj;
  }, {});
}