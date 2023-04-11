import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import iamConfig from '../../../config/iam.config';
import { RequestInfo } from '../../../commons/request-info';
import { RequestService } from '../../auth/service/request.service';

@Injectable()
export class GlobalIamHeadersCheckMiddleware implements NestMiddleware {
  private readonly logger = new Logger(GlobalIamHeadersCheckMiddleware.name);

  constructor(private readonly requestService: RequestService) {
    this.logger.log('starting');
  }

  async use(req: RequestInfo, res: Response, next: NextFunction) {
    const applicationUuid = req.header('application');
    if (!applicationUuid) {
      this.logger.error('Tentativa de uso de área restrita');
      throw new UnauthorizedException('Application header required');
    }
    if (applicationUuid !== iamConfig.MAIN_APP_IAM_MGT_ID) {
      this.logger.error('Tentativa de uso de área restrita');
      throw new UnauthorizedException('Application header not allowed');
    }

    req.applicationRef = await this.requestService.getApplicationRef(iamConfig.MAIN_APP_IAM_MGT_ID);

    next();
  }
}

@Injectable()
export class AppHeadersCheckMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AppHeadersCheckMiddleware.name);

  constructor(private readonly requestService: RequestService) {
    this.logger.log('starting');
  }

  async use(req: RequestInfo, res: Response, next: NextFunction) {
    const applicationUuid = req.header('application');
    if (!applicationUuid) {
      this.logger.error('Tentativa de acesso sem informar a região ou aplicação');
      throw new UnauthorizedException('Application header required');
    }
    if (typeof applicationUuid !== 'string') {
      this.logger.error('Tentativa de acesso com região ou aplicação malformado');
      throw new UnauthorizedException('Application header malformed');
    }

    req.applicationRef = await this.requestService.getApplicationRef(applicationUuid);

    next();
  }
}
