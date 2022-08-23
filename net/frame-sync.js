import Input from "../core/input.js";
import Node, { PauseMode } from "../core/node.js";
import { InputFrame, ServerFrame } from "./frame.js";
import ServerFrameInput from "./server-frame-input.js";

export default class FrameSyncNode extends Node {
  constructor(game) {
    super();
    this.game = game;
    this.setPauseMode(PauseMode.Stop);
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
    const inputFrame = this.frameNo < this.serverFrames.length
      ? this.serverFrames[this.frameNo]
      : this.serverFrames[this.serverFrames.length - 1];
    if (inputFrame) {
      ServerFrameInput.fromServerFrame(inputFrame);
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
    this.client.sendBinary(InputFrame.encode(this.root));
  }
}