import { Controller, Get } from '@nestjs/common';

@Controller('mgt/application')
export class ApplicationController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
