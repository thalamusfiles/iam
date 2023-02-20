import { Injectable } from '@nestjs/common';
import { JwtService as NestJWTService } from '@nestjs/jwt';
import { User } from '../../../model/User';
import { JwtUserInfo } from './jwt-user-info';

@Injectable()
export class JWTService {
  constructor(private readonly nestJwtService: NestJWTService) {}

  private userInfo(user: User): JwtUserInfo {
    return {
      uuid: user.uuid,
      name: user.name,
      regionLogged: '',
      applicationLogged: '',
    };
  }

  generate(user: User): string {
    return this.nestJwtService.sign(this.userInfo(user));
  }
}
