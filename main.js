import Game from './game.js';
import Input from './input.js';
import { initRandomSeed } from './random.js';
import { drawDebugInfo, parseSearchParams } from './utils.js';

window.addEventListener('load', () => {
  const loadingEl = document.getElementById('loading');
  loadingEl.style.display = 'none';

  const canvas = document.getElementById('canvas1');
  canvas.width = 900;
  canvas.height = 500;
  canvas.style.display = 'block';
  
  const context = canvas.getContext('2d');

  const searchParams = parseSearchParams();
  initRandomSeed(searchParams.r || new Date().getTime().toString());

  const game = new Game(canvas.width, canvas.height);

  game.hud.draw(context);
  game.draw(context);

  Input.addKeyListener(
    game.onKeyPressed.bind(game),
    game.onKeyReleased.bind(game));

  //let timer = 0;

  let lastTime = 0;
  function animate(nowTime) {
    const deltaTime = (nowTime - lastTime) / 1000;
    lastTime = nowTime;

    //timer += deltaTime;
    /*
    if (timer < 0.016*24) {
      requestAnimationFrame(animate);
      return;
    } else {
      timer = 0;
    }*/
    
    if (Game.isPause) {
      requestAnimationFrame(animate);
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    game.draw(context, deltaTime);
    game.update(deltaTime);

    if (Game.isDebugMode && Game.debugOptions.displayStatesInfo) {
      drawDebugInfo(context, game, deltaTime);
    }
    
    requestAnimationFrame(animate); 
  }

  requestAnimationFrame((nowTime) => {
    lastTime = nowTime;
    requestAnimationFrame(animate);
  });
});