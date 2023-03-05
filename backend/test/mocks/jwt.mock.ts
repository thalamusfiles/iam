import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtUserInfo } from '../../src/app/auth/jwt/jwt-user-info';

@Injectable()
export class JTWGuardMockAdmin extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user: Partial<JwtUserInfo> /*, info*/) {
    user = {
      uuid: '11111111-1111-1111-1111-111111111111',
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
