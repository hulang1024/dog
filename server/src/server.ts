import { WebSocket, Server, RawData } from 'ws';
import GamePlayHandler from './game-play';
import Player, { PlayerManager } from './player';
import Room from './room';

export default class GameServer {
  wsServer: Server<WebSocket> | null = null;
  playerManager = new PlayerManager();

  start(port: number) {
    this.wsServer = new Server({
      port
    });

    const gamePlayHandler = new GamePlayHandler(this);

    // Test
    const room = new Room();

    this.wsServer.on('close', () => {
      console.log('close');
    });
    this.wsServer.on('connection', (ws, req) => {
      const uid = parseInt(req.url?.substring(6)!);
      console.log(uid);
      if (isNaN(uid)) {
        ws.close();
        return;
      }

      console.debug('connection');

      let player = this.playerManager.get(uid);
      if (player) {
        player.client = ws;
      } else {
        player = new Player(uid, ws);
        this.playerManager.add(player);
      }
      if (room.players.size < 2) {
        player.room = room;
        room.players.add(player);
      }
      console.log(this.playerManager.count())

      ws.on('message', (data: RawData, isBinary: boolean) => {
        if (isBinary) {
          gamePlayHandler.onFrame(data, player!);
        } else {
          // handleTextMessage
        }
      });
    });
  }
}
