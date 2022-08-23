import { WebSocket } from "ws";
import Room from "./room";

export default class Player {
  id: number;
  client: WebSocket;
  room: Room | null = null;

  constructor(id: number, client: WebSocket) {
    this.id = id;
    this.client = client;
  }
}

export class PlayerManager {
  idToPlayer: Map<number, Player> = new Map();

  add(player: Player) {
    this.idToPlayer.set(player.id, player);
  }

  get(key: number) {
    return this.idToPlayer.get(key as number);
  }
  
  count() {
    return this.idToPlayer.size;
  }
}