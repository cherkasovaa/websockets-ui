import { WebSocket } from 'ws';
import Logger from '../logger/Logger';
import Game from '../models/Game';
import Player from '../models/Player';
import Room from '../models/Room';
import Ship from '../models/Ship';
import GameService from '../services/GameService';
import PlayerService from '../services/PlayerService';
import RoomService from '../services/RoomService';
import {
  AvailableRooms,
  RegResponseData,
  SERVER_TYPES,
  WSRequest,
  WSResponse,
} from '../types/server.types';
import { ShipData } from '../types/ship.types';

export default class MessageHandler {
  private logger: Logger;
  private playerService: PlayerService;
  private roomService: RoomService;
  private gameService: GameService;
  private connections: Map<WebSocket, Player> = new Map();
  private roomConnections: Map<WebSocket, Room> = new Map();
  private gameConnections: Map<WebSocket, Game> = new Map();
  private clients: Set<WebSocket> = new Set();

  constructor(
    logger: Logger,
    playerService: PlayerService,
    roomService: RoomService,
    gameService: GameService,
  ) {
    this.playerService = playerService;
    this.roomService = roomService;
    this.gameService = gameService;
    this.logger = logger;
  }

  public handleMessage(ws: WebSocket, msg: string): void {
    try {
      const message: WSRequest = JSON.parse(msg);

      switch (message.type) {
        case SERVER_TYPES.REG:
          this.handleReg(ws, message.data);
          this.broadcastUpdateRoom();
          break;
        case SERVER_TYPES.CREATE_ROOM:
          this.handleCreateRoom(ws);
          this.broadcastUpdateRoom();
          break;
        case SERVER_TYPES.ADD_USER_TO_ROOM:
          this.handleAddUserToRoom(ws, message.data);
          this.broadcastUpdateRoom();
          break;
        case SERVER_TYPES.ADD_SHIPS:
          this.handleAddShips(ws, message.data);
          break;
        default:
          this.logger.error(`Unknown command type: ${message.type}`);
          break;
      }
    } catch (error: unknown) {
      const err = error as Error;

      throw new Error(`[MessageHandler Error]: ${err.message}`);
    }
  }

  public addClient(ws: WebSocket): void {
    this.clients.add(ws);
  }

  public removeClient(ws: WebSocket): void {
    this.clients.delete(ws);
  }

  private handleReg(ws: WebSocket, data: string): void {
    const requestData = JSON.parse(data);
    const result = this.playerService.register(
      requestData.name,
      requestData.password,
    );

    const responseData: RegResponseData = {
      name: result.player?.name || '',
      index: result.player?.id || '',
      error: result.error,
      errorText: result.errorText,
    };

    const response: WSResponse = {
      type: SERVER_TYPES.REG,
      data: JSON.stringify(responseData),
      id: 0,
    };

    ws.send(JSON.stringify(response));

    if (result.player) {
      this.connections.set(ws, result.player);
    }
  }

  private handleCreateRoom(ws: WebSocket): void {
    const player: Player | undefined = this.connections.get(ws);

    if (!player) {
      this.logger.error('Player not found for this connection');
      return;
    }

    const room: Room = this.roomService.createRoom(player);

    this.logger.log(`Room ${room.id} created by player ${player.name}`);

    this.roomConnections.set(ws, room);
  }

  private handleAddUserToRoom(ws: WebSocket, data: string): void {
    const requestData = JSON.parse(data);
    const indexRoom: string = requestData.indexRoom;

    const player: Player | undefined = this.connections.get(ws);

    if (!player) {
      this.logger.error('Player not found for this connection');
      return;
    }

    let firstPlayerWS: WebSocket | undefined;
    let room: Room | undefined;

    for (const [ws, r] of this.roomConnections.entries()) {
      if (r.id === indexRoom) {
        firstPlayerWS = ws;
        room = r;
        break;
      }
    }

    if (!firstPlayerWS || !room) {
      this.logger.error('Player or room not found for this connection');
      return;
    }

    this.roomService.addPlayerToRoom(player, indexRoom);
    this.roomConnections.set(ws, room);

    const firstPlayer: Player | undefined = this.connections.get(firstPlayerWS);

    if (!firstPlayer) {
      this.logger.error('Player not found for this connection');
      return;
    }

    const game = this.gameService.createGame(indexRoom, firstPlayer, player);

    this.gameConnections.set(firstPlayerWS, game);
    this.gameConnections.set(ws, game);

    const response1: WSResponse = {
      type: SERVER_TYPES.CREATE_GAME,
      data: JSON.stringify({
        idGame: indexRoom,
        idPlayer: firstPlayer.id,
      }),
      id: 0,
    };

    const response2: WSResponse = {
      type: SERVER_TYPES.CREATE_GAME,
      data: JSON.stringify({
        idGame: indexRoom,
        idPlayer: player.id,
      }),
      id: 0,
    };

    firstPlayerWS.send(JSON.stringify(response1));
    ws.send(JSON.stringify(response2));
  }

  private broadcastUpdateRoom(): void {
    const rooms: AvailableRooms = this.roomService.availableRooms;

    const response: WSResponse = {
      type: SERVER_TYPES.UPDATE_ROOM,
      data: JSON.stringify(rooms),
      id: 0,
    };

    const message: string = JSON.stringify(response);

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  public handleAddShips(ws: WebSocket, data: string): void {
    const game = this.gameConnections.get(ws);

    if (!game) {
      this.logger.error('Game not found for this connection');
      return;
    }

    const requestData = JSON.parse(data);
    const { gameId, ships: shipsData, indexPlayer } = requestData;

    const ships: Ship[] = shipsData.map(
      (data: ShipData) =>
        new Ship(data.position, data.direction, data.length, data.type),
    );

    this.gameService.addShips(gameId, indexPlayer, ships);
    this.logger.log(`Player ${indexPlayer} added ships to game ${gameId}`);

    if (this.gameService.isGameReady(gameId)) {
      this.startGame(game);
    }
  }

  public startGame(game: Game): void {
    const playersWSList: WebSocket[] = [];

    for (const [ws, g] of this.gameConnections.entries()) {
      if (g.id === game.id) {
        playersWSList.push(ws);
      }
    }

    playersWSList.forEach((ws) => {
      const player = this.connections.get(ws);

      if (!player) return;

      const playerShips = game.getPlayerShips(player.id);

      const shipsData: ShipData[] = playerShips.map((playerShip) => ({
        position: playerShip.position,
        direction: playerShip.direction,
        length: playerShip.length,
        type: playerShip.type,
      }));

      const response: WSResponse = {
        type: SERVER_TYPES.START_GAME,
        data: JSON.stringify({
          ships: shipsData,
          currentPlayerIndex: player.id,
        }),
        id: 0,
      };

      ws.send(JSON.stringify(response));
    });

    this.sendTurn(game);
  }

  public sendTurn(game: Game): void {
    const currentPlayerId = game.currentPlayerId;

    for (const [ws, g] of this.gameConnections.entries()) {
      if (g.id === game.id) {
        const response: WSResponse = {
          type: SERVER_TYPES.TURN,
          data: JSON.stringify({
            currentPlayer: currentPlayerId,
          }),
          id: 0,
        };

        ws.send(JSON.stringify(response));
      }
    }
  }
}
