import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessUserInfo } from '../../src/app/auth/passaport/access-user-info';
import { DateTime } from 'luxon';
import iamConfig from '../../src/config/iam.config';

@Injectable()
export class JTWGuardMockAdmin extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user: Partial<AccessUserInfo> /*, info*/) {
    user = {
      iat: DateTime.now().valueOf(),
      uuid: iamConfig.MAIN_APP_IAM_ID,
      name: 'Admin',
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
