import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { UseCaseMGTService } from './usecasemgt.service';

@Module({
  providers: [UseCaseMGTService],
  exports: [UseCaseMGTService],
})
export class UseCaseMgtModule implements OnModuleInit {
  private readonly logger = new Logger(UseCaseMgtModule.name);

  async onModuleInit() {
    this.logger.log('initialized');
  }
}
