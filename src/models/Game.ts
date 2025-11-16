import { AttackStatus, GamePlayer } from '../types/game.types';
import Player from './Player';
import Ship from './Ship';

export default class Game {
  private gameId: string;
  private currentTurn: string;
  private players: Map<string, GamePlayer>;

  constructor(id: string, player1: Player, player2: Player) {
    this.gameId = id;

    this.currentTurn = player1.id;
    this.players = new Map();
    this.players.set(player1.id, { player: player1, ships: [] });
    this.players.set(player2.id, { player: player2, ships: [] });
  }

  get id(): string {
    return this.gameId;
  }

  get currentPlayerId(): string {
    return this.currentTurn;
  }

  public addShips(playerId: string, ships: Ship[]): void {
    const currentPlayer = this.players.get(playerId);

    if (!currentPlayer) {
      throw new Error(`Player ${playerId} not found in game`);
    }

    currentPlayer.ships = ships;
  }

  public getPlayerShips(playerId: string): Ship[] {
    const player = this.players.get(playerId);

    return player?.ships || [];
  }

  public switchTurn(): void {
    const playerIds = Array.from(this.players.keys());

    this.currentTurn =
      playerIds.find((id) => id !== this.currentTurn) || playerIds[0];
  }

  public checkBothPlayerReady(): boolean {
    return Array.from(this.players.values()).every(
      (player) => player.ships.length,
    );
  }

  public checkWinner(): string | null {
    for (const [playerId, player] of this.players.entries()) {
      const allShipsKilled = player.ships.every((ship) => ship.isKilled);

      if (allShipsKilled && player.ships.length > 0) {
        const winner = Array.from(this.players.keys()).find(
          (id) => id !== playerId,
        );

        return winner || null;
      }
    }

    return null;
  }

  public attack(
    x: number,
    y: number,
  ): {
    status: AttackStatus;
    killedShip: Ship | null;
  } {
    const enemy = Array.from(this.players.values()).find(
      (player) => player.player.id !== this.currentPlayerId,
    );

    if (!enemy) {
      throw new Error('The user for attack is not found');
    }

    for (const ship of enemy.ships) {
      const isHit = ship.hit({ x, y });

      if (isHit) {
        if (ship.isKilled) {
          return {
            status: 'killed',
            killedShip: ship,
          };
        } else {
          return {
            status: 'shot',
            killedShip: null,
          };
        }
      }
    }

    return {
      status: 'miss',
      killedShip: null,
    };
  }
}
