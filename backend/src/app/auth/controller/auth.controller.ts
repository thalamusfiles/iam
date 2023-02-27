import { Body, Controller, Headers, Ip, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormException } from '../../../types/form.exception';
import { AuthService, AuthLoginResp } from '../service/auth.service';
import { AuthRegisterNameUseCase } from '../../iam/usecase/auth-register-name.usecase';
import { AuthRegisterPasswordUseCase } from '../../iam/usecase/auth-register-password.usecase';
import { AuthRegisterUsernameUseCase } from '../../iam/usecase/auth-register-username.usecase';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';
import { Throttle } from '@nestjs/throttler';
import iamConfig from '../../../config/iam.config';
import { AuthRegisterMaxRegisterIpUseCase } from '../../iam/usecase/auth-register-max-register-ip';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Registra um novo usuário.
   * As validações são realizadas por meio de casos de uso
   * @param body
   * @returns
   */
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  @Post('local/register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async localRegister(
    @Body() body: AuthRegisterDto,
    @Headers('region') region,
    @Headers('application') application,
    @Ip() ip: string,
  ): Promise<AuthLoginResp> {
    this.logger.log('Registro Local de Usuários');

    //Executa os casos de uso com validações
    const allErros = [].concat(
      await AuthRegisterNameUseCase.execute(body),
      await AuthRegisterUsernameUseCase.execute(body),
      await AuthRegisterPasswordUseCase.execute(body),
      await AuthRegisterMaxRegisterIpUseCase.execute({ ip }),
    );

    if (allErros.length) {
      throw new FormException(allErros);
    }

    await this.authService.localRegister(body);

    return this.authService.localLogin(body.username, body.password, { region, application });
  }

  /**
   * Realiza o login do usuário
   * @param body
   * @returns
   */
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  @Post('local/login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async localLogin(@Body() body: AuthLoginDto, @Headers('region') region, @Headers('application') application): Promise<AuthLoginResp> {
    this.logger.log('Login Local');

    return this.authService.localLogin(body.username, body.password, { region, application });
  }
}
