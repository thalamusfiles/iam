import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { Application } from '../../../model/System/Application';
import { Region } from '../../../model/System/Region';
import { User } from '../../../model/User';
import { ApplicationNormalizeInitialsUseCase } from './application-normalize-initials.usecase';
import { BaseAddCreatedByUseCase } from './base-addcreatedby.usecase';
import { BaseAddUpdatedByUseCase } from './base-addupdatedby.usecase';
import { RegionNormalizeInitialsUseCase } from './region-normalize-initials.usecase';
import { UseCaseMGTService } from './usecasemgt.service';

@Module({
  providers: [UseCaseMGTService],
  exports: [UseCaseMGTService],
})
export class UseCaseMgtModule implements OnModuleInit {
  private readonly logger = new Logger(UseCaseMgtModule.name);

  constructor(private readonly useCaseService: UseCaseMGTService) {}

  async onModuleInit() {
    this.logger.log('Recording MGT Use Cases');

    // Registros dos casos de uso. Como são poucos, eles foram mantidos aqui.
    this.registerRegionUseCases();
    this.registerApplicationUseCases();
    this.registerUserUseCases();
  }

  registerRegionUseCases() {
    this.useCaseService.register(Region, BaseAddCreatedByUseCase);
    this.useCaseService.register(Region, BaseAddUpdatedByUseCase);
    this.useCaseService.register(Region, RegionNormalizeInitialsUseCase);
  }

  registerApplicationUseCases() {
    this.useCaseService.register(Application, BaseAddCreatedByUseCase);
    this.useCaseService.register(Application, BaseAddUpdatedByUseCase);
    this.useCaseService.register(Application, ApplicationNormalizeInitialsUseCase);
  }

  registerUserUseCases() {
    this.useCaseService.register(User, BaseAddCreatedByUseCase);
    this.useCaseService.register(User, BaseAddUpdatedByUseCase);
  }
}
