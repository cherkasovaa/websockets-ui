import 'dotenv/config';
import process from 'process';
import { WebSocketServer } from 'ws';
import Logger from '../logger/Logger';

const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8080;

const wss = new WebSocketServer({ port: PORT });
const logger = new Logger('WS');

wss.on('connection', function connection(ws) {
  logger.log('Client connected');

  ws.on('error', (err) => {
    logger.error(err.message);
  });

  ws.on('message', function message(data) {
    logger.log(`received: ${data}`);
  });

  ws.on('close', function close() {
    logger.log('Client disconnected');
  });
});

wss.on('listening', function listening() {
  logger.log(`Start websocket server on the ${PORT} port!`);
});
