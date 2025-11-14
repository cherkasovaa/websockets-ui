import 'dotenv/config';
import process from 'process';
import { RawData, WebSocketServer } from 'ws';
import Logger from '../logger/Logger';
import PlayerService from '../services/PlayerService';
import MessageHandler from './MessageHandler';

const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 3000;

const logger = new Logger('WS');
const playerService = new PlayerService(logger);
const messageHandler = new MessageHandler(logger, playerService);

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', function connection(ws) {
  logger.log('Client connected');

  ws.on('error', (err) => {
    logger.error(err.message);
  });

  ws.on('message', function message(data: RawData) {
    messageHandler.handleMessage(ws, data.toString());
  });

  ws.on('close', function close() {
    logger.log('Client disconnected');
  });
});

wss.on('listening', function listening() {
  logger.log(`Start websocket server on the ${PORT} port!`);
});
