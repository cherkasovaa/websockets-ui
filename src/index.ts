import 'dotenv/config';
import process from 'process';
import { httpServer } from './http_server/index';

const HTTP_PORT = process.env.PORT || 8181;
console.log(`Start static http server on the ${HTTP_PORT} port!`);

httpServer.listen(HTTP_PORT);
