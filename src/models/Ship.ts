import { Position, ShipType } from '../types/ship.types';

export default class Ship {
  private _position: Position;
  private _direction: boolean;
  private _length: number;
  private _type: ShipType;
  private hits: Position[];

  constructor(
    position: Position,
    direction: boolean,
    length: number,
    type: ShipType,
  ) {
    this._position = position;
    this._direction = direction;
    this._length = length;
    this._type = type;
    this.hits = [];
  }

  get position(): Position {
    return this._position;
  }

  get direction(): boolean {
    return this._direction;
  }

  get length(): number {
    return this._length;
  }

  get type(): ShipType {
    return this._type;
  }

  get isKilled(): boolean {
    return this.hits.length === this._length;
  }

  public getOccupiedCells(): Position[] {
    const cells: Position[] = [];

    for (let i = 0; i < this._length; i++) {
      if (this._direction) {
        cells.push({ x: this._position.x, y: this._position.y + i });
      } else {
        cells.push({ x: this._position.x + i, y: this._position.y });
      }
    }

    return cells;
  }

  public hit({ x, y }: Position): boolean {
    const occupiedCells = this.getOccupiedCells();

    const isHit = occupiedCells.some((cell) => cell.x === x && cell.y === y);

    if (!isHit) {
      return false;
    }

    const isAlreadyHit = this.hits.some((hit) => hit.x === x && hit.y === y);

    if (isAlreadyHit) {
      return true;
    }

    this.hits.push({ x, y });
    return true;
  }

  public getCellsAround(): Position[] {
    const cells: Position[] = [];
    const occupied = this.getOccupiedCells();

    occupied.forEach((cell) => {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const x = cell.x + dx;
          const y = cell.y + dy;

          if (x >= 0 && x < 10 && y >= 0 && y < 10) {
            const isShipCell = occupied.some((c) => c.x === x && c.y === y);

            if (!isShipCell) {
              const shouldAdd = cells.some((c) => c.x === x && c.y === y);

              if (!shouldAdd) {
                cells.push({ x, y });
              }
            }
          }
        }
      }
    });

    return cells;
  }
}
