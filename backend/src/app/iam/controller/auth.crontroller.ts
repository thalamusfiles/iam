import { Body, Controller, Post } from '@nestjs/common';
import { JwtUserInfo } from '../../auth/jwt/jwt-user-info';
import { JWTService } from '../../auth/jwt/jwt.service';
import { AuthService } from '../../auth/service/auth.service';
import { AuthLoginDto } from './dto/auth.dto';

@Controller('iam/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JWTService) {}

  @Post('login/local')
  async loginLocal(@Body() body: AuthLoginDto): Promise<{ access_token: string; userInfo: JwtUserInfo }> {
    const user = await this.authService.getByLogin(body.username, body.password);

    return {
      access_token: this.jwtService.generate(user),
      userInfo: this.jwtService.userInfo(user),
    };
  }
}
