import Logger from '../logger/Logger';
import Player from '../models/Player';
import Room from '../models/Room';
import { AvailableRooms } from '../types/server.types';

export default class RoomService {
  private rooms: Map<string, Room>;
  private logger: Logger;

  constructor(logger: Logger) {
    this.rooms = new Map();
    this.logger = logger;
  }

  get availableRooms(): AvailableRooms {
    return Array.from(this.rooms.values())
      .filter((room) => room.players.length === 1)
      .map((room) => ({
        roomId: room.id,
        roomUsers: room.players.map((player) => ({
          name: player.name,
          index: player.id,
        })),
      }));
  }

  public createRoom(player: Player): Room {
    const room = new Room();
    room.addPlayer(player);

    this.rooms.set(room.id, room);

    this.logger.log(`Room with ID=${room.id} was created`);
    return room;
  }

  public addPlayerToRoom(player: Player, roomId: string): boolean {
    const room: Room | undefined = this.findRoom(roomId);

    if (!room) {
      this.logger.error(
        `Can't add player. The room with ID=${roomId} does not found`,
      );
      return false;
    }

    this.logger.log(`Player successfully added to the room with ID=${roomId}`);

    room.addPlayer(player);

    return true;
  }

  public removeEmptyRoom(roomId: string): void {
    const room: Room | undefined = this.rooms.get(roomId);

    if (room && !room.players.length) {
      this.rooms.delete(roomId);
    }
  }

  public findRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }
}
