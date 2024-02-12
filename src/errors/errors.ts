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

export const openErrorWindow = (errorMessage: string) => {
  const errorWindow = window.open("", "_blank", "width=400,height=300");
  if (errorWindow) {
    errorWindow.document.write(`<h2>Error</h2><p>${errorMessage}</p>`);
  } else {
    console.error("Error: Could not open window.");
  }
};
