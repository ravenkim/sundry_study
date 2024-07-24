import { Controller, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Post()
  findAll(): string {
    return 'This action returns all cats';
  }

}
