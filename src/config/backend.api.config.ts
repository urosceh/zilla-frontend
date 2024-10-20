export const BackendApiConfig = {
  _protocol: process.env.REACT_APP_API_PROTOCOL || "http",
  _host: process.env.REACT_APP_API_HOST || "localhost",
  _port: process.env.REACT_APP_API_PORT || "3000",
  _basePath: process.env.REACT_APP_API_BASE_PATH || "api",

  getBaseUrl: function (): string {
    return `${this._protocol}://${this._host}:${this._port}/${this._basePath}`;
  },
};
