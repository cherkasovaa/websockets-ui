import 'dotenv/config';
import process from 'process';
import { httpServer } from './http_server/index';
import Logger from './logger/Logger';
import './websocket/server';

const logger = new Logger('HTTP');
const HTTP_PORT = process.env.PORT || 8181;

logger.log(`Start static http server on the ${HTTP_PORT} port!`);

httpServer.listen(HTTP_PORT);
