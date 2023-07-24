import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../../../config/jwt.config';
import { RequestInfo } from '../../../commons/request-info';
import { IdTokenInfo } from './access-user-info';
import { RequestService } from '../service/request.service';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(AccessStrategy.name);

  constructor(private readonly authService: AuthService, private readonly requestService: RequestService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.SECRET,
      ignoreExpiration: jwtConfig.IGNORE_EXPIRATION,
      passReqToCallback: true,
    });
  }

  async validate(request: RequestInfo, auth: IdTokenInfo): Promise<Partial<IdTokenInfo>> {
    const token = request.headers.authorization.substring(7);
    const isValid = await this.authService.validateAccessToken(token);

    // Verifica se tem permissão para alterar a aplicação
    if (request.applicationRef && !(await this.requestService.checkUserApplicationPermition(auth.sub, request.applicationRef.uuid))) {
      this.logger.error('Tentativa de acesso com aplicação malformado');
      throw new UnauthorizedException('Application header not allowed');
    }

    if (isValid) {
      return {
        iat: auth.iat,
        sub: auth.sub,
        name: auth.name,
        aud: auth.aud,
      };
    }

    return null;
  }
}
