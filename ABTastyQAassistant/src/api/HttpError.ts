export class HttpError extends Error {
  public statusCode: number;

  public headers?: Record<string, unknown>;

  public constructor(statusCode: number, message: string, headers?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.headers = headers;
  }
}
