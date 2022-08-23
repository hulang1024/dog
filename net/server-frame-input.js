import Input from '../core/input.js'

const pressedKeys = new Set();
const pressedListeners = new Set();
const releasedListeners = new Set();

const checkKeys = [
  Input.Keys.Up,
  Input.Keys.Right,
  Input.Keys.Down,
  Input.Keys.Left,
  Input.Keys.Space
];

const ServerFrameInput = {
  Keys: Input.Keys,
  addKeyListener(pressedL, releasedL) {
    if (pressedL) {
      pressedListeners.add(pressedL);
    }
    if (releasedL) {
      releasedListeners.add(releasedL);
    }
  },

  fromServerFrame(frame) {
    frame.keyPressedStates.forEach((isPressed, i) => {
      const key = checkKeys[i];
      if (isPressed) {
        if (!pressedKeys.has(key)) {
          pressedKeys.add(key);
          pressedListeners.forEach((l) => l(key));
        }
      } else {
        if (pressedKeys.has(key)) {
          pressedKeys.delete(key);
          releasedListeners.forEach((l) => l(key));
        }
      }
    });
  },

  isPressed(key) {
    return pressedKeys.has(key);
  },

  isPressedAny(InputKeys) {
    return Input.Keys.find(k => pressedKeys.has(k));
  }
};

export default ServerFrameInput;