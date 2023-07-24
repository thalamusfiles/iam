import { Body, Controller, Get, Headers, Ip, Logger, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { FormException } from '../../../commons/form.exception';
import { AuthService } from '../service/auth.service';
import { AuthRegisterNameUseCase } from '../usecase/auth-register-name.usecase';
import { AuthRegisterPasswordUseCase } from '../usecase/auth-register-password.usecase';
import { AuthRegisterUsernameUseCase } from '../usecase/auth-register-username.usecase';
import { AuthLoginDto, AuthLoginRespDto, AuthRegisterDto } from './dto/auth.dto';
import { Throttle } from '@nestjs/throttler';
import iamConfig from '../../../config/iam.config';
import { AuthRegisterMaxRegisterIpUseCase } from '../usecase/auth-register-max-register-ip';
import { AccessGuard } from '../passaport/access.guard';
import { RequestInfo } from '../../../commons/request-info';
import { ResponseInfo } from '../../../commons/response-info';
import { CookieService } from '../service/cookie.service';
import { AuthOauthFieldsUseCase } from '../usecase/auth-oauth-fields.usecase';
import { AuthLoginClientIdUseCase } from '../usecase/auth-register-client_id.usecase';
import { IamValidationPipe } from '../../../commons/validation.pipe';
import { OauthInfoService } from '../service/oauthinfo.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly oauthInfoService: OauthInfoService,
    // Use cases
    private readonly authRegisterNameUseCase: AuthRegisterNameUseCase,
    private readonly authRegisterUsernameUseCase: AuthRegisterUsernameUseCase,
    private readonly authRegisterPasswordUseCase: AuthRegisterPasswordUseCase,
    private readonly authRegisterMaxRegisterIpUseCase: AuthRegisterMaxRegisterIpUseCase,
    private readonly authOauthFieldsUseCase: AuthOauthFieldsUseCase,
    private readonly authLoginClienteIdUseCase: AuthLoginClientIdUseCase,
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
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  @UsePipes(new IamValidationPipe())
  async register(
    @Body() body: AuthRegisterDto,
    @Req() request: RequestInfo,
    @Res({ passthrough: true }) response: ResponseInfo,
    @Headers('User-Agent') userAgent,
    @Ip() ip: string,
  ): Promise<AuthLoginRespDto> {
    this.logger.log('Auth register');

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

    return this.login(body, request, response, userAgent, ip);
  }

  /**
   * Realiza o login do usuário
   * @param body
   * @returns
   */
  @Post('login')
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  @UsePipes(new IamValidationPipe())
  async login(
    @Body() body: AuthLoginDto,
    @Req() request: RequestInfo,
    @Res({ passthrough: true }) response: ResponseInfo,
    @Headers('User-Agent') userAgent,
    @Ip() ip: string,
  ): Promise<AuthLoginRespDto> {
    this.logger.log('Auth login');

    //Executa os casos de uso com validações
    const allErros = [].concat(
      //
      await this.authOauthFieldsUseCase.execute(body),
      await this.authLoginClienteIdUseCase.execute(body),
    );
    if (allErros.length) {
      throw new FormException(allErros);
    }

    const loginInfo = this.authService.startLoginInfo({
      userAgent,
      ip,
      clientId: body.client_id,
      responseType: body.response_type,
      redirectUri: body.redirect_uri,
      scope: body.scope,
      codeChallenge: body.code_challenge,
      codeChallengeMethod: body.code_challenge_method,
    });

    const cookieId = this.cookieService.createOrRefreshSSOCookie(request, response, true);
    loginInfo.sessionToken = cookieId;

    // Procura usuários e cria token de acesso
    const userLogin = await this.authService.findUserLoginByUsername(body.username, body.password);
    const authResp = await this.authService.createAccessToken(userLogin.user, userLogin, loginInfo);
    // Se necessário cria código de autorização para coleta de token entre aplicaçõe. Criptografa o code challange com esse código
    let code = null;
    if (loginInfo.codeChallenge) {
      code = this.oauthInfoService.generateAuthorizationCode();
      loginInfo.codeChallenge = this.oauthInfoService.encriptCodeChallengWithSalt(loginInfo.codeChallenge, code);
    }
    // Verifica se é uma aplicação pública e se o usuário tem acesso
    await this.authService.verifyApplicationUserAccess(userLogin.user.uuid, loginInfo.clientId);
    // Remove todos os logins anteriores da máquina
    await this.authService.removeOldTokens(userLogin.user.uuid, userAgent, ip);
    // Format redirect Uril
    authResp.callbackUri = await this.oauthInfoService.createCallbackUri(body.redirect_uri, body.response_type, body.state, code);
    // Salva o registro do novo login
    await this.authService.saveUserToken(loginInfo);

    //Todo: Remover este bloco.
    return { ...authResp, info: { name: '12312' } } as any;
  }

  /**
   * Refresca o token, inviabiliza o access token anterior e gera um novo.
   */
  @Get('refresh')
  @UseGuards(AccessGuard)
  async refresh(@Req() request: RequestInfo, @Ip() ip: string): Promise<AuthLoginRespDto> {
    this.logger.log('refresh');

    const token = request.headers.authorization.substring(7);

    const loginInfo = this.authService.startLoginInfo({
      ip,
      responseType: 'token',
    });

    const authResp = await this.authService.refreshAccessToken(token, loginInfo);

    await this.authService.saveUserToken(loginInfo);

    return authResp;
  }

  /**
   * Inviabiliza o token de acesso no banco.
   * Desloga o usuário da sessão
   */
  @Get('logout')
  @UseGuards(AccessGuard)
  async logout(@Req() request: RequestInfo, @Res({ passthrough: true }) response: ResponseInfo): Promise<void> {
    this.logger.log('logout');

    this.cookieService.clearCookies(request, response);
  }
}
