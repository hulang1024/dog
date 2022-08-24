import { StateId } from "./state-table.js";

export { StateId };

export class State {
  constructor(id, player) {
    this.id = id;
    this.player = player;
    this.game = player.game;
    this.camera = player.game.camera;
    this.prevState = null;
  }
  
  to(newStateId, args) {
    const { player } = this;
    if (player.nowState && newStateId == player.nowState.id) {
      return;
    }
    player.nowState = player.stateTable[newStateId];
    player.nowState.prevState = this;
    player.nowState.onEnter(args);
    console.log('State:', this.id + '->' + newStateId);
  }

  onEnter() {}

  onUpdate(delta) {}

  onKeyPressed(key) {}

  onKeyReleased(key) {}
}