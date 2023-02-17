import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UseCaseMGTService {
  private readonly logger = new Logger(UseCaseMGTService.name);

  async execute(): Promise<void> {
    this.logger.error('11111111111111111');
    this.logger.error('22222222222222222');
  }
}
