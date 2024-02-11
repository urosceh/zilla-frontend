import Cookies from "universal-cookie";

export class ClientCookies {
  private _cookies: Cookies;
  private static _instance: ClientCookies;

  private constructor() {
    this._cookies = new Cookies();
  }

  public static getCookies(): Cookies {
    if (!this._instance) {
      this._instance = new ClientCookies();
    }

    return this._instance._cookies;
  }
}
