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
        // 低3个字节记录帧号，高位(1字节 * 玩家数-1)记录输入操作
        let updateFrame = new ArrayBuffer(3 + roomPlayers.size - 1);
        let dv = new DataView(updateFrame);
        dv.setUint32(0, this.frameId, true);
        let offset = 3;
        roomPlayers.forEach((other) => {
          if (player != other) {
            dv.setUint8(offset++, other.frames[this.frameId] || 0);
          }
        });
        if (player.client.readyState == 1) {
          player.client.send(Buffer.from(updateFrame));
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