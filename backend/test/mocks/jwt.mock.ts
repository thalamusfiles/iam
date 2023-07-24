import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IdTokenInfo } from '../../src/app/auth/passaport/access-user-info';
import { DateTime } from 'luxon';
import iamConfig from '../../src/config/iam.config';

@Injectable()
export class JTWGuardMockAdmin extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user: IdTokenInfo /*, info*/) {
    user = {
      iat: DateTime.now().valueOf(),
      sub: '11111111-1111-1111-1111-111111111111',
      name: iamConfig.FIRST_USER_NAME,
      aud: iamConfig.MAIN_APP_IAM,
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
