import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../../../config/jwt.config';
import { RequestInfo } from '../../../commons/request-info';
import { AuthService } from '../service/auth.service';
import { AccessUserInfo } from './access-user-info';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(AccessStrategy.name);

  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.SECRET,
      ignoreExpiration: jwtConfig.IGNORE_EXPIRATION,
      passReqToCallback: true,
    });
  }

  async validate(req: RequestInfo, auth: AccessUserInfo): Promise<Partial<AccessUserInfo>> {
    const token = req.headers.authorization.substring(7);
    const isValid = await this.authService.validateAccessToken(token);

    // Coletado via Header check
    if (req.applicationRef && !(await this.authService.checkUserApplicationPermition(auth.uuid, req.applicationRef.uuid))) {
      this.logger.error('Tentativa de acesso com aplicação malformado');
      throw new UnauthorizedException('Application header not allowed');
    }

    if (isValid) {
      return {
        iat: auth.iat,
        uuid: auth.uuid,
        name: auth.name,
        applicationLogged: auth.applicationLogged,
      };
    }

    return null;
  }
}
