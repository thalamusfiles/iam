import { Controller, Get } from '@nestjs/common';

@Controller('iam/login')
export class LoginController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
