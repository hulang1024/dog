import GameObject from "./game-object.js";
import Game from "./game.js";
import Vector2 from "./vector.js";

const sounds = [];
const soundsStates = [];

export function pauseAllSounds() {
  sounds.forEach((sound, i) => {
    soundsStates[i] = sound.playing;
    sound.pause();
  });
}

export function resumeAllSounds() {
  sounds.forEach((sound, i) => {
    if (soundsStates[i]) {
      sound.play();
    } else {
      sound.pause();
    }
  });
}

export class Sound2D extends GameObject {
  constructor(src, game, listener) {
    super();
    this.game = game;
    this.listener = listener || game.player;
    this.audio = new Audio();
    this.audio.volume = 0;
    this.audio.src = src;
    this.minVolume = 0;
    this.maxVolume = 1;
    this.volumeFactor = 1;
    this.playing = false;
    this.maxDistance = Vector2.ZERO.distance(
      new Vector2(this.game.viewportWidth, this.game.viewportHeight));
    sounds.push(this);
  }

  update() {
    const distance = this.parent.position.distance(this.listener.position);
    let volume = (1 - distance / this.maxDistance) * this.volumeFactor;
    volume = Math.min(this.maxVolume, volume);
    volume = Math.max(this.minVolume, volume);
    this.audio.volume = volume;
  }

  draw(ctx) {
    if (!(Game.isDebugMode && Game.debugOptions.displaySound2DVolume)) {
      return;
    }
    ctx.save();
    ctx.font = '14px monospace';
    if (this.game.theme == 'forest') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    }
    ctx.fillText('Volume:' + this.audio.volume.toFixed(6),
      this.parent.position.x, this.parent.position.y);
    ctx.restore();
  }

  play() {
    this.playing = true;
    this.audio.play();
  }

  pause() {
    this.playing = false;
    this.audio.pause();
  }

  delete() {
    this.audio.pause();
    const i = sounds.indexOf(this);
    if (i >= 0) {
      sounds.splice(i, 1);
      soundsStates.splice(i, 1);
    }
  }
}