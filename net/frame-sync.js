import Node, { PauseMode } from "../core/node.js";
import SocketClient from "./ws.js";
import InputFrame from "./input-frame.js";

export default class FrameSyncNode extends Node {
  constructor() {
    super();
    this.setPauseMode(PauseMode.Stop);
  }

  enterTree() {
    // TODO: 只是测试
    this.client = new SocketClient(() => {
      this.root.isPause = false;
    });
    this.client.onData((data) => {
      if (data instanceof Blob) {
        InputFrame.decode(data, (inputFrame) => {
          console.log(inputFrame.toString());
        });
      }
    });
  }

  update() {
    this.client.sendBinary(InputFrame.encode(this.root));
  }
}