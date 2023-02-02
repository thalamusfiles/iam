import { Controller, Get } from '@nestjs/common';

@Controller('mgt/user')
export class UserController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
