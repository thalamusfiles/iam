import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IdTokenInfo } from '../../src/app/auth/passaport/access-user-info';
import { DateTime } from 'luxon';
import iamConfig from '../../src/config/iam.config';
import jwtConfig from '../../src/config/jwt.config';
import appsConfig from '../../src/config/apps.config';

@Injectable()
export class JTWGuardMockAdmin extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user: IdTokenInfo /*, info*/) {
    user = {
      iss: jwtConfig.ISS,
      iat: DateTime.now().valueOf(),
      sub: 'b688ddb8-19a2-4d5e-8452-b10518800ceb',
      name: iamConfig.FIRST_USER_NAME,
      aud: appsConfig.MAIN_APP_IAM,
    };

    return user as any;
  }
}

@Injectable()
export class JTWGuardMockInactivated extends AuthGuard('jwt') {
  canActivate() {
    return false;
  }

  handleRequest(err, user) {
    if (true) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
