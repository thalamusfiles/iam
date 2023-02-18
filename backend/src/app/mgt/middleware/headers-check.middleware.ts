import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class GlobalAppHeadersCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const region = req.header('region');
    const application = req.header('application');
    if (!region || !application) {
      throw new UnauthorizedException('Region and Application Required');
    }
    if (region !== 'global' || application !== 'iam') {
      throw new UnauthorizedException('Region and Application Not Allowed');
    }
    next();
  }
}
