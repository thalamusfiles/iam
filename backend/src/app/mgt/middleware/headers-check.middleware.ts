import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestInfo } from '../../../commons/request-info';
import { RequestService } from '../../auth/service/request.service';

@Injectable()
export class AppHeadersCheckMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AppHeadersCheckMiddleware.name);

  constructor(private readonly requestService: RequestService) {
    this.logger.log('starting');
  }

  async use(req: RequestInfo, res: Response, next: NextFunction) {
    const applicationUuid = req.header('application');
    if (!applicationUuid) {
      this.logger.error('Tentativa de acesso sem informar aplicação');
      throw new UnauthorizedException('Application header required');
    }
    if (typeof applicationUuid !== 'string') {
      this.logger.error('Tentativa de acesso com aplicação malformado');
      throw new UnauthorizedException('Application header malformed');
    }

    req.applicationRef = await this.requestService.getApplicationRef(applicationUuid);

    next();
  }
}
