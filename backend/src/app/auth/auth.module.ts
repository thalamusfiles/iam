import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { User } from '../../model/User';
import { UserLogin } from '../../model/UserLogin';
import { Application } from '../../model/System/Application';
import jwtConfig from '../../config/jwt.config';
import { AccessStrategy } from './passaport/access.strategy';
import { AuthService } from './service/auth.service';
import { RequestService } from './service/request.service';
import { AuthController } from './controller/auth.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserToken } from '../../model/UserToken';
import { CookieService } from './service/cookie.service';
import { CryptService } from './service/crypt.service';
import { AuthLoginClientIdUseCase } from './usecase/auth-register-client_id.usecase';
import { AuthRegisterNameUseCase } from './usecase/auth-register-name.usecase';
import { AuthRegisterUsernameUseCase } from './usecase/auth-register-username.usecase';
import { AuthRegisterPasswordUseCase } from './usecase/auth-register-password.usecase';
import { AuthRegisterMaxRegisterIpUseCase } from './usecase/auth-register-max-register-ip';
import { AuthOauthFieldsUseCase } from './usecase/auth-oauth-fields.usecase';
import { OauthInfoService } from './service/oauthinfo.service';
import { OauthController } from './controller/oauth.controller';
import { Role } from '../../model/Role';
import { AuthOauthAuthorizeFieldsUseCase } from './usecase/auth-oauth-authorize-fields.usecase';

@Module({
  imports: [
    //
    PassportModule.register({ session: true }),
    //JwtModule.register({ secretOrPrivateKey: jwtConfig.SECRET, signOptions: { algorithm: 'RS256' } }),
    JwtModule.register({ secret: jwtConfig.SECRET }),
    ThrottlerModule.forRoot(/*{ limit: iamConfig.REGISTER_RATE_LIMITE, ttl: iamConfig.REGISTER_RATE_LIMITE_REST_TIME }*/),
    MikroOrmModule.forFeature([Application, User, UserLogin, UserToken, Role]),
  ],
  providers: [
    CryptService,
    CookieService,
    RequestService,
    AuthService,
    OauthInfoService,
    AccessStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    //UseCases
    AuthRegisterNameUseCase,
    AuthRegisterUsernameUseCase,
    AuthRegisterPasswordUseCase,
    AuthRegisterMaxRegisterIpUseCase,
    AuthOauthFieldsUseCase,
    AuthOauthAuthorizeFieldsUseCase,
    AuthLoginClientIdUseCase,
  ],
  exports: [AuthService, RequestService],
  controllers: [
    //
    AuthController,
    OauthController,
  ],
})
export class AuthModule implements NestModule {
  private readonly logger = new Logger(AuthModule.name);

  configure(/*consumer: MiddlewareConsumer*/) {
    this.logger.log('configure');
  }
}
