import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormException } from '../../../types/form.exception';
import { AuthService, AuthLoginResp } from '../../auth/service/auth.service';
import { AuthRegisterPassword } from '../usecase/auth-register-password.usecase';
import { AuthRegisterUsername } from '../usecase/auth-register-username.usecase';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';

@Controller('iam/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async localRegister(@Body() body: AuthRegisterDto): Promise<AuthLoginResp> {
    //Executa os casos de uso
    const allErros = [].concat(
      //
      AuthRegisterUsername.preValidate(body),
      AuthRegisterPassword.preValidate(body),
    );

    if (allErros.length) {
      throw new FormException(allErros);
    }

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
