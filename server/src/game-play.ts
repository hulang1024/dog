import { RawData, WebSocket } from "ws";
import Player, { PlayerManager } from "./player";
import GameServer from "./server";

export default class GamePlayHandler {
  server: GameServer;
  playerManager: PlayerManager;

  constructor(server: GameServer) {
    this.server = server;
    this.playerManager = server.playerManager;
  }

  onFrame(data: RawData, fromPlayer: Player) {
    if (!(fromPlayer && fromPlayer.room)) {
      return;
    }
    fromPlayer.room.players.forEach((player) => {
      if (player != fromPlayer && player.client.readyState === WebSocket.OPEN) {
        player.client.send(data);
      }
    });
  }
}