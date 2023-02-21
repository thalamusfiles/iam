import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService, AuthLoginResp } from '../../auth/service/auth.service';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';

@Controller('iam/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async localRegister(@Body() body: AuthRegisterDto): Promise<AuthLoginResp> {
    this.authService.localRegister(body);
    return null;
  }

  @Post('local/login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async localLogin(@Body() body: AuthLoginDto): Promise<AuthLoginResp> {
    return await this.authService.localLogin(body.username, body.password);
  }

  private async validate(props: AuthRegisterDto): Promise<void> {
    console.log(props);
  }
}
