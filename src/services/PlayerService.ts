import Logger from '../logger/Logger';
import Player from '../models/Player';

export default class PlayerService {
  private players: Map<string, Player>;
  private logger: Logger;

  constructor(logger: Logger) {
    this.players = new Map();
    this.logger = logger;
  }

  public register(
    name: string,
    password: string,
  ): {
    player: Player | undefined;
    error: boolean;
    errorText: string;
  } {
    if (this.players.has(name)) {
      const player = this.players.get(name);
      this.logger.log(`The user with name ${name} was logged`);

      if (player?.validatePassword(password)) {
        this.logger.log('The password is success validate');
        return {
          player,
          error: false,
          errorText: '',
        };
      }

      this.logger.error('The password does not validate');
      return {
        player: undefined,
        error: true,
        errorText: 'Invalid password',
      };
    }

    const newPlayer = new Player(name, password);

    this.players.set(name, newPlayer);

    this.logger.log(`The user with name ${name} was created`);
    return {
      player: newPlayer,
      error: false,
      errorText: '',
    };
  }

  public getPlayerById(name: string): Player | undefined {
    return this.players.get(name);
  }

  public getWinners(): { name: string; wins: number }[] {
    return Array.from(this.players.values()).map((player) => ({
      name: player.name,
      wins: player.wins,
    }));
  }
}
