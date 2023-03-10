import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../../../config/jwt.config';
import { JwtUserInfo } from './jwt-user-info';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.SECRET,
      ignoreExpiration: jwtConfig.IGNORE_EXPIRATION,
    });
  }

  validate(auth: JwtUserInfo): Partial<JwtUserInfo> {
    // TODO: Realizar validação no banco de dados do token ou em serviço redis ou em sessão
    return {
      uuid: auth.uuid,
      name: auth.name,
      applicationLogged: auth.applicationLogged,
    };
  }
}
