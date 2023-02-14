import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JTWGuardMockAdmin extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return true;
  }

  handleRequest(err, user, info) {
    console.log(err);
    console.log(user);
    console.log(info);

    return user;
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
