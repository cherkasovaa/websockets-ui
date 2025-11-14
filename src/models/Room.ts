import Player from './Player';

export default class Room {
  private _id: string;
  private _players: Player[] = [];

  constructor() {
    this._id = Date.now() + crypto.randomUUID();
  }

  get id(): string {
    return this._id;
  }

  get players(): Player[] {
    return this._players;
  }

  public addPlayer(player: Player): boolean {
    if (this.isFull()) {
      return false;
    }

    this._players.push(player);
    return true;
  }

  public removePlayer(playerId: string): void {
    this._players = this.players.filter((player) => player.id !== playerId);
  }

  private isFull(): boolean {
    return this._players.length >= 2;
  }
}
