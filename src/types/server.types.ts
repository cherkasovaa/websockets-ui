export const SERVER_TYPES = {
  REG: 'reg',
  UPDATE_WINNERS: 'update_winners',
  CREATE_ROOM: 'create_room',
  ADD_USER_TO_ROOM: 'add_user_to_room',
  UPDATE_ROOM: 'update_room',
  CREATE_GAME: 'create_game',
  ADD_SHIPS: 'add_ships',
  START_GAME: 'start_game',
  TURN: 'turn',
} as const;

export type ServerTypes = (typeof SERVER_TYPES)[keyof typeof SERVER_TYPES];

export type RegRequestData = {
  name: string;
  password: string;
};

export type RegResponseData = {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
};

export type PlayerInRoom = {
  name: string;
  index: number | string;
};

export type AvailableRoom = {
  roomId: string;
  roomUsers: PlayerInRoom[];
};

export type AvailableRooms = AvailableRoom[];

export type Game = {
  idGame: string;
  idPlayer: string;
};

export type Winner = {
  name: string;
  wins: number;
};

export type WSRequest = {
  type: ServerTypes;
  data: string;
  id: number;
};

export type WSResponse = {
  type: ServerTypes;
  data: string;
  id: number;
};
