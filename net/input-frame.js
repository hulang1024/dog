import Input from "../core/input.js";
import { StateId } from "../player/state/state.js";

export default class InputFrame {
  constructor() {
    this.playerDead = false;
    this.pressedKeys = [];
  }

  toString() {
    return 'frame.playerDead=' + this.playerDead +
      '\nframe.pressedKeys=' + this.pressedKeys.join(',');
  }
}

InputFrame.decode = function(data, complete) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    if (ev.target.readyState != FileReader.DONE) {
      return;
    }

    const frame = new InputFrame();

    const dv = new DataView(ev.target.result);
    const v = dv.getUint8(0, true);
    frame.playerDead = v & 1;
    if (v & (1 << 1))
      frame.pressedKeys.push(Input.Keys.Up);
    if (v & (1 << 2))
      frame.pressedKeys.push(Input.Keys.Right);
    if (v & (1 << 3))
      frame.pressedKeys.push(Input.Keys.Down);
    if (v & (1 << 4))
      frame.pressedKeys.push(Input.Keys.Left);
    if (v & (1 << 5))
      frame.pressedKeys.push(Input.Keys.Space);
    complete(frame);
  };
  reader.readAsArrayBuffer(data);
};

InputFrame.encode = function(game) {
  let v = 0;

  v |= game.player.nowState.id == StateId.Dead;
  if (Input.isPressed(Input.Keys.Up))
    v |= 1 << 1;
  if (Input.isPressed(Input.Keys.Right))
    v |= 1 << 2;
  if (Input.isPressed(Input.Keys.Down))
    v |= 1 << 3;
  if (Input.isPressed(Input.Keys.Left))
    v |= 1 << 4;
  if (Input.isPressed(Input.Keys.Space))
    v |= 1 << 5;

  const buf = new Uint8Array(1);
  buf[0] = v;
  return buf;
};