import { Body, Controller, Get, Headers, Ip, Logger, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormException } from '../../../types/form.exception';
import { AuthService, AuthLoginResp } from '../service/auth.service';
import { AuthRegisterNameUseCase } from '../../iam/usecase/auth-register-name.usecase';
import { AuthRegisterPasswordUseCase } from '../../iam/usecase/auth-register-password.usecase';
import { AuthRegisterUsernameUseCase } from '../../iam/usecase/auth-register-username.usecase';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';
import { Throttle } from '@nestjs/throttler';
import iamConfig from '../../../config/iam.config';
import { AuthRegisterMaxRegisterIpUseCase } from '../../iam/usecase/auth-register-max-register-ip';
import { JWTGuard } from '../jwt/jwt.guard';
import { JwtUserInfo } from '../jwt/jwt-user-info';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {
    this.logger.log('initialized');
  }

  /**
   * Registra um novo usuário.
   * As validações são realizadas por meio de casos de uso
   * @param body
   * @returns
   */
  @Post('local/register')
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
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
  @Post('local/login')
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  @UsePipes(new ValidationPipe({ transform: true }))
  async localLogin(@Body() body: AuthLoginDto, @Headers('region') region, @Headers('application') application): Promise<AuthLoginResp> {
    this.logger.log('Login Local');

    return this.authService.localLogin(body.username, body.password, { region, application });
  }

  /**
   * Refresca o token, coleta o usuário e atualiza a data de espiração
   */
  @Get('refresh')
  @UseGuards(JWTGuard)
  async refresh(@Request() request: { user: JwtUserInfo }): Promise<JwtUserInfo> {
    return request.user;
  }
}
