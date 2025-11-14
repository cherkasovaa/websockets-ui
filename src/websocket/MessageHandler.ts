import { WebSocket } from 'ws';
import Logger from '../logger/Logger';
import PlayerService from '../services/PlayerService';
import { RegRequest, SERVER_TYPES } from '../types/server.types';

export default class MessageHandler {
  private logger: Logger;
  private playerService: PlayerService;

  constructor(logger: Logger, playerService: PlayerService) {
    this.playerService = playerService;
    this.logger = logger;
  }

  public handleMessage(ws: WebSocket, msg: string): void {
    try {
      const message: RegRequest = JSON.parse(msg);

      switch (message.type) {
        case SERVER_TYPES.REG:
          this.handleReg(ws, message.data);
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

  private handleReg(ws: WebSocket, data: string): void {
    const requestData = JSON.parse(data);
    const result = this.playerService.register(
      requestData.name,
      requestData.password,
    );

    const responseData = {
      name: result.player?.name || '',
      index: result.player?.id || '',
      error: result.error,
      errorText: result.errorText,
    };

    const response = {
      type: SERVER_TYPES.REG,
      data: JSON.stringify(responseData),
      id: 0,
    };

    ws.send(JSON.stringify(response));
  }
}
