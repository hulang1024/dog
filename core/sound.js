import Node2D from "./node2d.js";
import Game from "../game.js";
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

export class Sound2D extends Node2D {
  constructor(src, game, listener) {
    super();
    this.game = game;
    this.listener = listener || game.player;
    this.audio = new Audio();
    this.audio.src = src;
    this.audio.volume = 0;
    this.minVolume = 0;
    this.maxVolume = 1;
    this.volumeFactor = 1;
    this.playing = false;
    this.maxDistance = Vector2.ZERO.distanceTo(
      new Vector2(this.game.width, this.game.height));
    sounds.push(this);
  }

  update() {
    const distance = this.parent.position.distanceTo(this.listener.position);
    let volume = (1 - distance / this.maxDistance) * this.volumeFactor;
    volume = Math.min(this.maxVolume, volume);
    volume = Math.max(this.minVolume, volume);
    this.audio.volume = volume;
  }

  draw() {
    if (!(Game.isDebugMode && Game.debugOptions.displaySound2DVolume)) {
      return;
    }
    this.drawText(
      '14px monospace', this.parent.position,
      'Volume:' + this.audio.volume.toFixed(6),
      this.game.theme == 'forest' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)')
  }

  play() {
    this.playing = true;
    this.audio.play();
  }

  pause() {
    this.playing = false;
    this.audio.pause();
  }

  exitTree() {
    this.audio.pause();
    const i = sounds.indexOf(this);
    if (i >= 0) {
      sounds.splice(i, 1);
      soundsStates.splice(i, 1);
    }
  }
}