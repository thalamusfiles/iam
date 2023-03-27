import { Body, Controller, Get, Headers, Ip, Logger, Post, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormException } from '../../../types/form.exception';
import { AuthService, LoginInfo } from '../service/auth.service';
import { AuthRegisterNameUseCase } from '../usecase/auth-register-name.usecase';
import { AuthRegisterPasswordUseCase } from '../usecase/auth-register-password.usecase';
import { AuthRegisterUsernameUseCase } from '../usecase/auth-register-username.usecase';
import { ApplicationInfoDto, AuthLoginDto, AuthLoginRespDto, AuthRegisterDto } from './dto/auth.dto';
import { Throttle } from '@nestjs/throttler';
import iamConfig from '../../../config/iam.config';
import { AuthRegisterMaxRegisterIpUseCase } from '../usecase/auth-register-max-register-ip';
import { AccessGuard } from '../passaport/access.guard';
import { RequestInfo } from '../../../types/request-info';
import { ResponseInfo } from '../../../types/response-info';
import { CookieService } from '../service/cookie.service';
import { AuthOauthFieldsUseCase } from '../usecase/auth-oauth-fields.usecase';
import { AuthLoginClientIdUseCase } from '../usecase/auth-register-client_id.usecase';
import { IamValidationPipe } from '../../../types/validation.pipe';
import { ApplicationService } from '../service/application.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly applicationService: ApplicationService,
    private readonly authRegisterNameUseCase: AuthRegisterNameUseCase,
    private readonly authRegisterUsernameUseCase: AuthRegisterUsernameUseCase,
    private readonly authRegisterPasswordUseCase: AuthRegisterPasswordUseCase,
    private readonly authRegisterMaxRegisterIpUseCase: AuthRegisterMaxRegisterIpUseCase,
    private readonly authOauthFieldsUseCase: AuthOauthFieldsUseCase,
    private readonly authLoginClienteId: AuthLoginClientIdUseCase,
  ) {
    this.logger.log('starting');
  }

  /**
   * Coleta o nome da aplicação para exibir na tela de login
   * @param body
   * @returns
   */
  @Get('application/info')
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  @UsePipes(new ValidationPipe({ transform: true }))
  async applicationInfo(@Query() query?: ApplicationInfoDto): Promise<{ uuid: string; name: string }> {
    this.logger.log('Registro Local de Usuários');

    const { uuid, name } = await this.applicationService.find(query.uuid);
    return { uuid, name };
  }

  /**
   * Registra um novo usuário.
   * As validações são realizadas por meio de casos de uso
   * @param body
   * @returns
   */
  @Post('register')
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  @UsePipes(new ValidationPipe({ transform: true }))
  async localRegister(
    @Body() body: AuthRegisterDto,
    @Req() request: RequestInfo,
    @Res({ passthrough: true }) response: ResponseInfo,
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
    );

    if (allErros.length) {
      throw new FormException(allErros);
    }

    await this.authService.register(body);

    return this.localLogin(body, request, response, userAgent, ip);
  }

  /**
   * Realiza o login do usuário
   * @param body
   * @returns
   */
  @Post('login')
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  @UsePipes(new IamValidationPipe())
  async localLogin(
    @Body() body: AuthLoginDto,
    @Req() request: RequestInfo,
    @Res({ passthrough: true }) response: ResponseInfo,
    @Headers('User-Agent') userAgent,
    @Ip() ip: string,
  ): Promise<AuthLoginRespDto> {
    this.logger.log('Login Local');

    //Executa os casos de uso com validações
    const allErros = [].concat(
      //
      await this.authOauthFieldsUseCase.execute(body),
      await this.authLoginClienteId.execute(body),
    );

    if (allErros.length) {
      throw new FormException(allErros);
    }

    const appInfo: LoginInfo = {
      userUuid: null,
      userLoginUuid: null,
      clientId: body.cliente_id,
      userAgent,
      ip,
      responseType: body.response_type,
      redirectUri: body.redirect_uri,
      scope: body.scope,
      sessionToken: null,
      accessToken: null,
      expiresIn: null,
    };

    /*const oldCookieId = this.cookieService.getSSOCookie(request);
    if (oldCookieId) {
      this.authService.invalidateSession(oldCookieId);
    }*/
    const cookieId = this.cookieService.createOrRefreshSSOCookie(request, response, true);
    appInfo.sessionToken = cookieId;

    const authResp = await this.authService.findAndCreateAccessToken(body.username, body.password, appInfo);

    await this.authService.saveUserToken(appInfo);

    return authResp;
  }

  /**
   * Refresca o token, inviabiliza o access token anterior e gera um novo.
   */
  @Get('refresh')
  @UseGuards(AccessGuard)
  async refresh(@Req() request: RequestInfo, @Ip() ip: string): Promise<AuthLoginRespDto> {
    const token = request.headers.authorization.substring(7);

    const appInfo: LoginInfo = {
      userUuid: null,
      userLoginUuid: null,
      clientId: null,
      userAgent: null,
      ip,
      responseType: 'token',
      redirectUri: null,
      scope: null,
      sessionToken: null,
      accessToken: null,
      expiresIn: null,
    };

    const authResp = await this.authService.refreshAccessToken(token, appInfo);

    await this.authService.saveUserToken(appInfo);

    return authResp;
  }

  /**
   * Inviabiliza o token de acesso no banco.
   * Desloga o usuário da sessão
   */
  @Get('logout')
  @UseGuards(AccessGuard)
  async logout(@Req() request: RequestInfo, @Res({ passthrough: true }) response: ResponseInfo): Promise<void> {
    this.cookieService.clearCookies(request, response);
  }

  @Get('oauth2/authorize')
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  async oauth2Authorize(@Req() request: RequestInfo, @Res() res, @Body() body: AuthRegisterDto): Promise<string> {
    this.logger.log('Oauth2 authorize');

    //Executa os casos de uso com validações
    const allErros = [].concat(
      //
      await this.authOauthFieldsUseCase.execute(body),
      await this.authLoginClienteId.execute(body),
    );

    if (allErros.length) {
      throw new FormException(allErros);
    }

    const cookieId = this.cookieService.getSSOCookie(request);
    if (cookieId) {
      return res.redirect(body.redirect_uri);
    } else {
      return res.redirect('/login');
    }
  }

  @Get('oauth2/token')
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  async oauth2Token(@Req() request: RequestInfo): Promise<string> {
    return '' + request;
  }
}
