import Node, { PauseMode } from "./node.js";

export default class Timer extends Node {
  constructor(timeout) {
    super();
    this.setPauseMode(PauseMode.Stop);
    this.timeout = timeout;
    this.time = 0;
    this.callbacks = [];
  }

  update(delta) {
    this.time += delta * (1000 / this.root.deltaRate);
    if (this.time >= this.timeout) {
      this.time = 0;
      this._emitTimeout();
      this.queueFree();
    }
  }

  onTimeout(cb) {
    this.callbacks.push(cb);
  }

  _emitTimeout() {
    this.callbacks.forEach((cb) => {
      cb();
    });
  }
}