import { Injectable } from '@nestjs/common';
import { JwtService as NestJWTService } from '@nestjs/jwt';
import { User } from '../../../model/User';

@Injectable()
export class JWTService {
  constructor(private readonly nestJwtService: NestJWTService) {}

  private userInfo(user: User): Partial<User> {
    return {
      uuid: user.uuid,
      name: user.name,
    };
  }

  generate(user: User): string {
    return this.nestJwtService.sign(this.userInfo(user));
  }
}
