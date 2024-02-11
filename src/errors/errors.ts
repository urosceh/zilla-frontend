export class DomainError {
  private _code: number;
  private _message: string;

  constructor(code: number, message: string) {
    this._code = code;
    this._message = message;
  }
}

export enum ErrorCode {
  BadResponse = 502,
}
