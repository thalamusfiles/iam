import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { Region } from '../../../model/System/Region';
import { BaseAddCreatedByUseCase } from './base-addcreatedby.usecase';
import { BaseAddUpdatedByUseCase } from './base-addupdatedby.usecase';
import { RegionNormalizeInitialsUseCase } from './region-normalize-initials.usecase';
import { UseCaseMGTService } from './usecasemgt.service';

@Module({
  providers: [UseCaseMGTService],
  exports: [UseCaseMGTService]
})
export class UseCaseMgtModule implements OnModuleInit {
  private readonly logger = new Logger(UseCaseMgtModule.name);

  constructor(private readonly useCaseService: UseCaseMGTService) {}

  async onModuleInit() {
    this.logger.log('Recording MGT Use Cases');

    this.registerRegionUseCases();
  }

  registerRegionUseCases() {
    this.useCaseService.register(Region, BaseAddCreatedByUseCase);
    this.useCaseService.register(Region, BaseAddUpdatedByUseCase);
    this.useCaseService.register(Region, RegionNormalizeInitialsUseCase);
  }
}
