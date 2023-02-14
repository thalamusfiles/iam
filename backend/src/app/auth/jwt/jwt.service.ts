import { Injectable } from '@nestjs/common';
import { JwtService as NestJWTService } from '@nestjs/jwt';
import { User } from '../../../model/User';

@Injectable()
export class JWTService {
  constructor(private readonly nestJwtService: NestJWTService) {}

  userInfo(user: User): Partial<User> {
    return {
      uuid: user.uuid,
      name: user.name,
    };
  }

  generate(user: Partial<User>): string {
    return this.nestJwtService.sign(user);
  }
}
