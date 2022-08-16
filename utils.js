import Enemy from "./enemies/enemy.js";
import { Particle } from './effect/particle.js';
import Input from "./input.js";

const BASE_X = 160;
const BASE_Y = 28;

export function drawDebugInfo(ctx, game, delta) {
  const { player, camera } = game;
  let y = BASE_Y;
  let newLine = () => y += 20;

  ctx.save();
  ctx.font = '14px monospace';
  if (game.theme == 'forest') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  }
  ctx.fillText('camera.x: ' + camera.position.x.toFixed(2), BASE_X, BASE_Y);
  ctx.fillText('camera.smoothingEnabled: ' + camera.smoothingEnabled, BASE_X, newLine());
  ctx.fillText('camera.smoothingSpeed:   ' + camera.smoothingSpeed, BASE_X, newLine());
  ctx.fillText('camera.followTarget:     '
    + (camera.followTarget ? camera.followTarget.constructor.name : null), BASE_X, newLine());
  ctx.fillText('camera.lookAtTarget:     '
    + (camera.lookAtTarget ? camera.lookAtTarget.constructor.name : null), BASE_X, newLine());
  ctx.fillText('object count:   ' + countObject(game), BASE_X, newLine());
  ctx.fillText('enemy count:    ' + game.enemyManager.count(), BASE_X, newLine());
  ctx.fillText('particle count: ' + game.particleGroup.count(), BASE_X, newLine());
  ctx.fillText('player.velocity:  ' + player.velocity.toString(), BASE_X, newLine());
  ctx.fillText('player.position:  ' + player.position.toString(), BASE_X, newLine());
  ctx.fillText('player.state:     ' + player.nowState.id, BASE_X, newLine());

  y = BASE_Y;
  const fps = Math.round(1 / delta);
  ctx.fillText('FPS:   ' + fps, game.viewportWidth - 128, BASE_Y);
  ctx.fillText('Delta: ' + delta.toFixed(6), game.viewportWidth - 128, newLine());

  ctx.fillText('Input.pressedKeys:', game.viewportWidth - 158, newLine());
  Input.getPressedKeys().forEach((key) => {
    ctx.fillText(key, game.viewportWidth - 70, newLine());
  });

  ctx.restore();
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