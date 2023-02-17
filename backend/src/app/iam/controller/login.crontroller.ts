import { Controller, Get, Ip } from '@nestjs/common';

@Controller('iam/login')
export class LoginController {
  @Get()
  findAll(@Ip() ip): string {
    return 'This action returns all cats:' + ip;
  }
}
