import Player from '../models/Player';
import Ship from '../models/Ship';

export interface GamePlayer {
  player: Player;
  ships: Ship[];
}
