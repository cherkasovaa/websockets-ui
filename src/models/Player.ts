export default class Player {
  private _id: string;
  private _name: string;
  private _password: string;
  private _wins: number = 0;

  constructor(name: string, password: string) {
    this._name = name;
    this._password = password;
    this._id = this.generateId();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get wins(): number {
    return this._wins;
  }

  public validatePassword(password: string) {
    return this._password === password;
  }

  public addWins(): void {
    this._wins += 1;
  }

  private generateId(): string {
    return Date.now() + crypto.randomUUID();
  }
}
