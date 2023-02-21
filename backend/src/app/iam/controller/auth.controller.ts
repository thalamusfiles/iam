import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormException } from '../../../types/form.exception';
import { AuthService, AuthLoginResp } from '../../auth/service/auth.service';
import { AuthRegisterNameUseCase } from '../usecase/auth-register-name.usecase';
import { AuthRegisterPasswordUseCase } from '../usecase/auth-register-password.usecase';
import { AuthRegisterUsernameUseCase } from '../usecase/auth-register-username.usecase';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';

@Controller('iam/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async localRegister(@Body() body: AuthRegisterDto): Promise<AuthLoginResp> {
    //Executa os casos de uso
    const allErros = [].concat(
      AuthRegisterNameUseCase.execute(body),
      AuthRegisterUsernameUseCase.execute(body),
      AuthRegisterPasswordUseCase.execute(body),
    );
    if (allErros.length) {
      throw new FormException(allErros);
    }

    await this.authService.localRegister(body);

    return this.authService.localLogin(body.username, body.password);
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
