import { syncInputKeys } from "./input.js";

export class InputFrame {
  constructor(playerIndex) {
    this.playerIndex = playerIndex;
    this.playerDead = false;
    this.keyPressedStates = [];
  }

  toString() {
    return 'playerIndex=' + this.playerIndex
      + '\n  playerDead=' + this.playerDead
      + '\n  keyPressedStates=' + this.keyPressedStates.join('');
  }

  encode() {
    let v = 0;
    // 低位死亡状态，高位按键状态
    v |= this.playerDead;
    for (let i = 0; i < this.keyPressedStates.length; i++) {
      if (this.keyPressedStates[i]) {
        v |= 1 << (i + 1);
      }
    }
    const arr = new Uint8Array(1);
    arr[0] = v;
    return arr;
  }
}

export class ServerFrame {
  constructor() {
    this.id = 0;
    this.playerFrames = [];
  }

  toString() {
    return 'frame.id=' + this.id + '\n' + this.playerFrames.join('\n');
  }
}

ServerFrame.decode = function(data, complete) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    if (ev.target.readyState != FileReader.DONE) {
      return;
    }

    const serverFrame = new ServerFrame();
    const dv = new DataView(ev.target.result);
    let v = dv.getUint32(0, true);
    serverFrame.id = v & 0xFFFFFF;
    for (let pi = 0; pi < dv.byteLength - 3; pi++) {
      v = dv.getUint8(3 + pi);
      const frame = new InputFrame(pi);
      frame.playerDead = v & 1;
      for (let b = 1; b <= syncInputKeys.length; b++) {
        frame.keyPressedStates.push(v & (1 << b));
      }
      serverFrame.playerFrames.push(frame);
    }
    complete(serverFrame);
  };
  reader.readAsArrayBuffer(data);
};
