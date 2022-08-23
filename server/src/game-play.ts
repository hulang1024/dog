import Player from "./player";
import GameServer from "./server";

export default class GamePlayHandler {
  server: GameServer;
  frameId = 0;
  timer: NodeJS.Timer | null = null;

  constructor(server: GameServer) {
    this.server = server;
  }

  stopFrameLoop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  clearFrames() {
    this.server.playerManager.players.forEach((player) => {
      player.frames = [];
    });
  }

  startFrameLoop() {
    if (this.timer) {
      return;
    }
    this.frameId = 0;
    const players = this.server.playerManager.players;
    const sendFrames = () => {
      players.forEach((player) => {
        // 向同房间的玩家发送其它玩家的帧
        const roomPlayers = player.room.players;
        let updateFrame = new Uint32Array(roomPlayers.size - 1);
        let index = 0;
        roomPlayers.forEach((other) => {
          if (player != other) {
            let input = other.frames[this.frameId];
            updateFrame[index++] = (input ? input << 24 : 0) | this.frameId;
          }
        });
        if (player.client.readyState == 1) {
          player.client.send(updateFrame);
        }
      });
      this.frameId++;
    };

    this.timer = setInterval(sendFrames, 1000 / 50);
  }

  onFrame(data: Buffer, player: Player) {
    const index = this.frameId <= player.frames.length
      ? player.frames.length
      : this.frameId;
    player.frames[index] = data.readUInt8();
  }
}