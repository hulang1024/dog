import Player from "./player";

let RoomId = 10;

export default class Room {
  id: number;
  players: Set<Player> = new Set();

  constructor() {
    this.id = RoomId++;
  }

  add(player: Player) {
    player.room = this;
    this.players.add(player);
  }
}

export class RoomManager {
  rooms: Set<Room> = new Set();

  create() {
    const room = new Room();
    this.rooms.add(room);
    return room;
  }
}

export const NullRoom = new Room();