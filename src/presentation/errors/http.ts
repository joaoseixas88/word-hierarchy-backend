export class HttpException extends Error {
  statusCode: number;

  constructor(message: string, statusCode?: number) {
    super();
    this.name = "HttpException";
    this.message = message;
    this.statusCode = statusCode || 400;
  }
}
