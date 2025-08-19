import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UserAlreadyExistsException extends HttpException {
  constructor(field: string, value: string) {
    super(`User with ${field} '${value}' already exists.`, HttpStatus.CONFLICT);
  }
}

@Injectable()
export class SchoolAlreadyExistsException extends HttpException {
  constructor(value: string) {
    super(`School with name '${value}' already exists.`, HttpStatus.CONFLICT);
  }
}
