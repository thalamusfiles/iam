import { Controller, Get } from '@nestjs/common';

@Controller('iam/me')
export class MeController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
