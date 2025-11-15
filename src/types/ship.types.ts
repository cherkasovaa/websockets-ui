export interface Position {
  x: number;
  y: number;
}

export type ShipType = 'small' | 'medium' | 'large' | 'huge';

export interface ShipData {
  position: Position;
  direction: boolean;
  length: number;
  type: ShipType;
}
