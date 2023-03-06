import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import iamConfig from '../../../config/iam.config';
import { RequestInfo } from '../../../types/request-info';
import { RequestService } from '../service/request.service';

@Injectable()
export class GlobalIamHeadersCheckMiddleware implements NestMiddleware {
  private readonly logger = new Logger(GlobalIamHeadersCheckMiddleware.name);

  constructor(private readonly requestService: RequestService) {
    this.logger.log('initialized');
  }

  async use(req: RequestInfo, res: Response, next: NextFunction) {
    const region = req.header('region');
    const application = req.header('application');
    if (!region || !application) {
      this.logger.error('Tentativa de uso de área restrita');
      throw new UnauthorizedException('Region and application required');
    }
    if (region !== iamConfig.MAIN_REGION || application !== iamConfig.MAIN_APP_IAM_MGT) {
      this.logger.error('Tentativa de uso de área restrita');
      throw new UnauthorizedException('Region and application not allowed');
    }

    req.applicationRef = await this.requestService.getApplicationRef(iamConfig.MAIN_APP_IAM_MGT);

    next();
  }
}

@Injectable()
export class RegionAppHeadersCheckMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RegionAppHeadersCheckMiddleware.name);

  constructor(private readonly requestService: RequestService) {
    this.logger.log('initialized');
  }

  async use(req: RequestInfo, res: Response, next: NextFunction) {
    const region = req.header('region');
    const application = req.header('application');
    if (!region || !application) {
      this.logger.error('Tentativa de acesso sem informar a região ou aplicação');
      throw new UnauthorizedException('Region and application required');
    }
    if (typeof region !== 'string' || typeof application !== 'string') {
      this.logger.error('Tentativa de acesso com região ou aplicação malformado');
      throw new UnauthorizedException('Region and application malformed');
    }

    req.regionRef = await this.requestService.getRegionRef(region);
    req.applicationRef = await this.requestService.getApplicationRef(application);

    next();
  }
}
