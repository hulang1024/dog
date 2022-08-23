import Input from "../core/input.js";
import { StateId } from "../player/state/state.js";

export class InputFrame {}
InputFrame.encode = function(game) {
  let v = 0;

  v |= game.player.nowState.id == StateId.Dead;
  if (Input.isPressed(Input.Keys.Up))
    v |= 2;
  if (Input.isPressed(Input.Keys.Right))
    v |= 4;
  if (Input.isPressed(Input.Keys.Down))
    v |= 8;
  if (Input.isPressed(Input.Keys.Left))
    v |= 0x10;
  if (Input.isPressed(Input.Keys.Space))
    v |= 0x20;

  const arr = new Uint8Array(1);
  arr[0] = v;
  return arr;
};

export class ServerFrame {
  constructor() {
    this.id = 0;
    this.playerDead = false;
    this.keyPressedStates = [];
  }

  toString() {
    return 'frame.id=' + this.id
      + '\nframe.playerDead=' + this.playerDead
      + '\nframe.keyPressedStates=' + this.keyPressedStates.join(',');
  }
}

ServerFrame.decode = function(data, complete) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    if (ev.target.readyState != FileReader.DONE) {
      return;
    }

    const frame = new ServerFrame();

    const dv = new DataView(ev.target.result);
    let v = dv.getUint32(0, true);
    frame.id = v & 0x3FFFFF;
    v >>= 24;
    frame.playerDead = v & 1;
    frame.keyPressedStates.push(v & 2);    // Input.Keys.Up
    frame.keyPressedStates.push(v & 4);    // Input.Keys.Right
    frame.keyPressedStates.push(v & 8);    // Input.Keys.Down
    frame.keyPressedStates.push(v & 0x10); // Input.Keys.Left
    frame.keyPressedStates.push(v & 0x20); // Input.Keys.Space
    complete(frame);
  };
  reader.readAsArrayBuffer(data);
};
