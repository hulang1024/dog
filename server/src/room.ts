import Player from "./player";

let RoomId = 10;

export default class Room {
  id: number;
  players: Set<Player> = new Set();

  constructor() {
    this.id = RoomId++;
  }
}
