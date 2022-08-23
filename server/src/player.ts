import { WebSocket } from "ws";
import { InputFrame } from "./frame";
import Room, { NullRoom } from "./room";

export default class Player {
  id: number;
  client: WebSocket;
  room: Room = NullRoom;
  frames: InputFrame[] = [];

  constructor(id: number, client: WebSocket) {
    this.id = id;
    this.client = client;
  }
}

export class PlayerManager {
  players: Set<Player> = new Set();
  idToPlayer: Map<number, Player> = new Map();

  add(player: Player) {
    this.players.add(player);
    this.idToPlayer.set(player.id, player);
  }

  get(key: number) {
    return this.idToPlayer.get(key as number);
  }
  
  count() {
    return this.idToPlayer.size;
  }
}