export class Response_error extends Error {
  constructor(public status: number, public message: string) {
    super(message);
  }
}
