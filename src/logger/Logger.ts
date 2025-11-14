import { styleText } from 'util';
import { Message, MSG_TYPE } from '../types/message.types';

export default class Logger {
  private prefix: string;

  constructor(prefix = '') {
    this.prefix = prefix;
  }

  public error(msg: string): void {
    this.message(msg, MSG_TYPE.ERROR);
  }

  public log(msg: string): void {
    this.message(msg, MSG_TYPE.MSG);
  }

  private message(msg: string, type: Message): void {
    const prefixText = this.prefix ? `[${this.prefix}]` : '';

    switch (type) {
      case MSG_TYPE.MSG:
        console.log(
          styleText('green', prefixText),
          styleText(['gray', 'bold'], this.getDate()),
          msg,
        );
        break;
      case MSG_TYPE.ERROR:
        console.error(
          styleText('red', prefixText),
          styleText(['gray', 'bold'], this.getDate()),
          msg,
        );
        break;
      default:
        console.log(
          styleText('green', prefixText),
          styleText(['gray', 'bold'], this.getDate()),
          msg,
        );
        break;
    }
  }

  private getDate(): string {
    const date = new Date();
    return date.toLocaleTimeString('ru');
  }
}
