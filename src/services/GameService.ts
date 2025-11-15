import Logger from '../logger/Logger';
import Game from '../models/Game';
import Player from '../models/Player';
import Ship from '../models/Ship';

export default class GameService {
  private games: Map<string, Game>;
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;

    this.games = new Map();
  }

  public createGame(gameId: string, player1: Player, player2: Player): Game {
    const game = new Game(gameId, player1, player2);

    this.games.set(gameId, game);

    this.logger.log(`The game with ID=${gameId} was created`);
    return game;
  }

  public addShips(gameId: string, playerId: string, ships: Ship[]): void {
    const game = this.findGame(gameId);

    if (!game) {
      this.logger.error(`The game with ID=${gameId} in not found`);
      return;
    }

    game.addShips(playerId, ships);
  }

  public findGame(gameId: string): Game | undefined {
    return this.games.get(gameId);
  }

  public removeGame(gameId: string): void {
    const game = this.findGame(gameId);

    if (game) {
      this.games.delete(gameId);
      this.logger.log(`The game with ID=${gameId} was deleted`);
    }
  }

  public isGameReady(gameId: string): boolean {
    const game = this.findGame(gameId);

    if (!game) {
      this.logger.error(`The game with ID=${gameId} in not found`);
      return false;
    }

    const ready = game.checkBothPlayerReady();

    if (ready) {
      this.logger.log(`The game with ID=${gameId} is ready to start`);
    }

    return ready;
  }
}
