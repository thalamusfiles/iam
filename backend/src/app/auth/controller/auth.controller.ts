import { Body, Controller, Get, Headers, Ip, Logger, Post, Req, Res, Session, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormException } from '../../../types/form.exception';
import { AuthService, LoginInfo } from '../service/auth.service';
import { AuthRegisterNameUseCase } from '../usecase/auth-register-name.usecase';
import { AuthRegisterPasswordUseCase } from '../usecase/auth-register-password.usecase';
import { AuthRegisterUsernameUseCase } from '../usecase/auth-register-username.usecase';
import { AuthLoginDto, AuthLoginRespDto, AuthRegisterDto } from './dto/auth.dto';
import { Throttle } from '@nestjs/throttler';
import iamConfig from '../../../config/iam.config';
import { AuthRegisterMaxRegisterIpUseCase } from '../usecase/auth-register-max-register-ip';
import { JWTGuard } from '../jwt/jwt.guard';
import { JwtUserInfo } from '../jwt/jwt-user-info';
import { RequestInfo } from '../../../types/request-info';
import { ResponseInfo } from '../../../types/response-info';
import { CookieService } from '../service/cookie.service';
import { AuthRegisterOauthFieldsUseCase } from '../usecase/auth-oauth-fields.usecase';
import { AuthRegisterClientIdUseCase } from '../usecase/auth-register-client_id.usecase';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly authRegisterNameUseCase: AuthRegisterNameUseCase,
    private readonly authRegisterUsernameUseCase: AuthRegisterUsernameUseCase,
    private readonly authRegisterPasswordUseCase: AuthRegisterPasswordUseCase,
    private readonly authRegisterMaxRegisterIpUseCase: AuthRegisterMaxRegisterIpUseCase,
    private readonly authRegisterOauthFieldsUseCase: AuthRegisterOauthFieldsUseCase,
    private readonly authRegisterClienteId: AuthRegisterClientIdUseCase,
  ) {
    this.logger.log('starting');
  }

  /**
   * Registra um novo usuário.
   * As validações são realizadas por meio de casos de uso
   * @param body
   * @returns
   */
  @Post('register')
  //@Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  @UsePipes(new ValidationPipe({ transform: true }))
  async localRegister(
    @Body() body: AuthRegisterDto,
    @Req() request: RequestInfo,
    @Res({ passthrough: true }) response: ResponseInfo,
    @Headers('application') application,
    @Headers('User-Agent') userAgent,
    @Ip() ip: string,
  ): Promise<AuthLoginRespDto> {
    this.logger.log('Registro Local de Usuários');

    //Executa os casos de uso com validações
    const allErros = [].concat(
      await this.authRegisterMaxRegisterIpUseCase.execute({ ip }),
      await this.authRegisterNameUseCase.execute(body),
      await this.authRegisterUsernameUseCase.execute(body),
      await this.authRegisterPasswordUseCase.execute(body),
      await this.authRegisterOauthFieldsUseCase.execute(body),
      await this.authRegisterClienteId.execute(body),
    );

    if (allErros.length) {
      throw new FormException(allErros);
    }

    await this.authService.register(body);

    return this.localLogin(body, request, response, application, userAgent, ip);
  }

  /**
   * Realiza o login do usuário
   * @param body
   * @returns
   */
  @Post('login')
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  @UsePipes(new ValidationPipe({ transform: true }))
  async localLogin(
    @Body() body: AuthLoginDto,
    @Req() request: RequestInfo,
    @Res({ passthrough: true }) response: ResponseInfo,
    @Headers('application') application,
    @Headers('User-Agent') userAgent,
    @Ip() ip: string,
  ): Promise<AuthLoginRespDto> {
    this.logger.log('Login Local');

    const appInfo: LoginInfo = {
      userUuid: null,
      userLoginUuid: null,
      application,
      applicationRef: request.applicationRef,
      userAgent,
      ip,
      sessionToken: null,
      accessToken: null,
      scope: body.scope,
    };

    const cookieId = this.cookieService.createOrRefreshSSOCookie(request, response, true);
    const authResp = this.authService.loginJwt(body.username, body.password, appInfo);

    appInfo.sessionToken = cookieId;

    this.authService.createUserToken(appInfo);

    return authResp;
  }

  @Get('oauth2/authorize')
  async oauth2Authorize(@Req() request: RequestInfo): Promise<string> {
    return '';
  }

  @Get('oauth2/token')
  async oauth2Token(@Req() request: RequestInfo): Promise<string> {
    return '';
  }

  /**
   * Inviabiliza o token de acesso no banco.
   * Desloga o usuário da sessão
   */
  @Get('logout')
  @UseGuards(JWTGuard)
  async logout(@Req() request: RequestInfo, @Res({ passthrough: true }) response: ResponseInfo): Promise<void> {
    this.cookieService.clearCookies(request, response);
  }

  /**
   * Refresca o token, coleta o usuário e atualiza a data de espiração
   */
  @Get('refresh')
  @UseGuards(JWTGuard)
  async refresh(@Req() request: { user: JwtUserInfo }): Promise<JwtUserInfo> {
    return request.user;
  }
}
