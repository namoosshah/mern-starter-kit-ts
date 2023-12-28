export class ErrorResponse extends Error {
  statusCode: number;
  errors?: Array<string>;
  constructor(message: string, statusCode: number, errors?: Array<string>) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
