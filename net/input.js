import Input from '../core/input.js'

export class RemotePlayerInput {
  constructor(player) {
    this.player = player;
    this.pressedKeys = new Set();
    this.pressedListeners = new Set();
    this.releasedListeners = new Set();
    this.Keys = Input.Keys;
  }

  addKeyListener(pressedL, releasedL) {
    if (pressedL) {
      this.pressedListeners.add(pressedL);
    }
    if (releasedL) {
      this.releasedListeners.add(releasedL);
    }
  }

  isPressed(key) {
    return this.pressedKeys.has(key);
  }

  isPressedAny(keys) {
    return keys.find(k => this.pressedKeys.has(k));
  }
}


// 游戏需要同步的按键，定义顺序对应位顺序
export const syncInputKeys = [
  Input.Keys.Up,
  Input.Keys.Right,
  Input.Keys.Down,
  Input.Keys.Left,
  Input.Keys.Space
];

const playerInputs = [];

export const RemotePlayerInputManager = {
  create(player) {
    const input = new RemotePlayerInput(player);
    playerInputs.push(input);
    return input;
  },
  reset() {
    playerInputs = [];
  },
  handleServerFrame(serverFrame) {
    serverFrame.playerFrames.forEach((frame, playerIndex) => {
      const {
        pressedKeys, pressedListeners, releasedListeners
      } = playerInputs[playerIndex];
      frame.keyPressedStates.forEach((isPressed, i) => {
        const key = syncInputKeys[i];
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
    });
  },
};