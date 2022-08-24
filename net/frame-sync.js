import Input from "../core/input.js";
import Node, { PauseMode } from "../core/node.js";
import { StateId } from "../player/state/state.js";
import { InputFrame, ServerFrame } from "./frame.js";
import { syncInputKeys, RemotePlayerInputManager } from "./input.js";

export default class FrameSyncNode extends Node {
  constructor(game) {
    super();
    this.setPauseMode(PauseMode.Stop);
    this.game = game;
    this.player = game.player;
    this.serverFrames = [];
    this.frameNo = 0;
  }

  enterTree() {
    // TODO: 只是测试
    this.client = this.game.socketClient;
    this.client.onMessage((data) => {
      if (data instanceof Blob) {
        ServerFrame.decode(data, (frame) => {
          this.serverFrames.push(frame);
        });
      } else if (typeof data == 'string') {
        const msg = JSON.parse(data);
        if (msg.type == 'start') {
          this.game.isPause = false;
        }
      }
    });
  }

  update() {
    while (this.serverFrames.length) {
      const serverFrame = this.serverFrames.shift();
      console.log(serverFrame.toString());
      RemotePlayerInputManager.handleServerFrame(serverFrame);
      if (this.serverFrames.length > 1) {
        serverFrame.playerFrames.forEach((frame) => {
          this.game.otherPlayers[frame.playerIndex].update(1 / 60);
          this.game.camera.update(1 / 60);
        });
      }
    }
    this.frameNo++;

    if (Input.pressedKeys.length) {
      this._sendInputFrame();
    }
  }

  onKeyPressed() {
    this._sendInputFrame();
  }

  onKeyReleased() {
    this._sendInputFrame();
  }

  _sendInputFrame() {
    if (this.game.isPause) {
      return;
    }
    const frame = new InputFrame(0);
    frame.playerDead = this.player.nowState.id == StateId.Dead;
    for (let i = 0; i < syncInputKeys.length; i++) {
      frame.keyPressedStates[i] = Input.isPressed(syncInputKeys[i]);
    }
    this.client.sendBinary(frame.encode());
  }
}