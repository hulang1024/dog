import Game from './game.js';
import Input from './core/input.js';
import { initRandomSeed } from './core/random.js';
import { parseSearchParams } from './utils.js';

window.addEventListener('load', () => {
  const loadingEl = document.getElementById('loading');
  loadingEl.style.display = 'none';

  const searchParams = parseSearchParams();
  initRandomSeed(searchParams.r || new Date().getTime().toString());

  const game = new Game();
  window.game = game;

  Input.addKeyListener(
    game.onKeyPressed.bind(game),
    game.onKeyReleased.bind(game));

  let lastTime = 0;
  let deltaTime;
  function animate(nowTime) {
    deltaTime = (nowTime - lastTime) / 1000;
    lastTime = nowTime;

    game.update(deltaTime);

    requestAnimationFrame(animate); 
  }

  requestAnimationFrame((nowTime) => {
    lastTime = nowTime;
    requestAnimationFrame(animate);
  });
});