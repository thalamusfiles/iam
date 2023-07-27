import { Body, Controller, Get, Headers, HttpCode, Ip, Logger, Post, Query, Req, Res, UsePipes } from '@nestjs/common';
import { FormException } from '../../../commons/form.exception';
import { Throttle } from '@nestjs/throttler';
import iamConfig from '../../../config/iam.config';
import { RequestInfo } from '../../../commons/request-info';
import { CookieService } from '../service/cookie.service';
import { AuthOauthFieldsUseCase } from '../usecase/auth-oauth-fields.usecase';
import { AuthLoginClientIdUseCase } from '../usecase/auth-register-client_id.usecase';
import { ApplicationInfoDto, ScopeInfoDto } from './dto/auth.dto';
import { OauthInfoService } from '../service/oauthinfo.service';
import { IamValidationPipe } from '../../../commons/validation.pipe';
import { AuthService } from '../service/auth.service';
import { AuthOauthAuthorizeFieldsUseCase } from '../usecase/auth-oauth-authorize-fields.usecase';
import { OauthFieldsDto, OauthTokenDto } from './dto/oauth.dto';

@Controller('auth')
export class OauthController {
  private readonly logger = new Logger(OauthController.name);

  constructor(
    private readonly cookieService: CookieService,
    private readonly oauthInfoService: OauthInfoService,
    private readonly authService: AuthService,
    private readonly authOauthFieldsUseCase: AuthOauthFieldsUseCase,
    private readonly authOauthAuthorizeFieldsUseCase: AuthOauthAuthorizeFieldsUseCase,
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
  @UsePipes(new IamValidationPipe())
  async applicationInfo(@Query() query?: ApplicationInfoDto): Promise<{ uuid: string; name: string }> {
    this.logger.log('Application info');

    const { uuid, name } = await this.oauthInfoService.findApplication(query.uuid);
    return { uuid, name };
  }

  /**
   * Coleta todas as permissões vinculadas aos escopos informados
   * @param body
   * @returns
   */
  @Get('scope/info')
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  @UsePipes(new IamValidationPipe())
  async scopeInfo(@Query() query?: ScopeInfoDto): Promise<any> {
    this.logger.log('Scope info');

    return await this.oauthInfoService.findScopesInfo(query.scope);
  }

  @Get('oauth2/authorize')
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  async oauth2Authorize(
    @Req() request: RequestInfo,
    @Res() res,
    @Query() query: OauthFieldsDto,
    @Headers('User-Agent') userAgent,
    @Ip() ip: string,
  ): Promise<any> {
    this.logger.log('Oauth2 authorize');

    //Executa os casos de uso com validações
    const allErros = [].concat(
      //
      await this.authOauthFieldsUseCase.execute(query),
      await this.authLoginClienteId.execute(query),
    );

    if (allErros.length) {
      throw new FormException(allErros);
    }

    //Coleta o cookie para verificar se já esta autênticado
    const cookieId = this.cookieService.getSSOCookie(request);

    if (cookieId) {
      const userToken = await this.authService.findUserTokenBySession(cookieId, query.scope);
      if (userToken) {
        const loginInfo = this.authService.startLoginInfo({
          userAgent,
          ip,
          userUuid: userToken.user.uuid,
          userLoginUuid: userToken.login.uuid,
          clientId: query.client_id,
          responseType: query.response_type,
          redirectUri: query.redirect_uri,
          scope: query.scope,
          codeChallenge: query.code_challenge,
          codeChallengeMethod: query.code_challenge_method,
          sessionToken: cookieId,
        });
        // Procura usuários e cria token de acesso
        await this.authService.createIdAndAccessToken(userToken.user, userToken.login, loginInfo);

        // Criar código de autorização para coleta de token entre aplicações e criptografa o code challange com esse código
        let code = null;
        if (query.code_challenge) {
          code = this.oauthInfoService.generateAuthorizationCode();
          loginInfo.codeChallenge = this.oauthInfoService.encriptCodeChallengWithSalt(loginInfo.codeChallenge, code);
        }

        // Verifica se é uma aplicação pública e se o usuário tem acesso
        await this.authService.verifyApplicationUserAccess(userToken.user.uuid, query.client_id);

        const redirectUri = this.oauthInfoService.createCallbackUri(query.redirect_uri, query.response_type, query.state, code);

        // Salva o registro do novo login
        if (loginInfo.responseType !== 'cookie') {
          await this.authService.saveUserToken(loginInfo);
        }

        return res.redirect(redirectUri);
      }
    }

    const baseUrl = `/public/app/${query.client_id}/login`;
    const params = this.oauthInfoService.createOauthParams(query);

    return res.redirect(baseUrl + '?' + params);
  }

  @Post('oauth2/token')
  @HttpCode(200)
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  async oauth2Token2(@Req() request: RequestInfo, @Body() body): Promise<OauthTokenDto> {
    this.logger.log('oauth2Token');

    //Executa os casos de uso com validações
    const allErros = [].concat(
      //
      await this.authOauthAuthorizeFieldsUseCase.execute(body),
    );

    if (allErros.length) {
      throw new FormException(allErros);
    }

    // Gera o code challeng encriptado
    const codeChallenge = this.oauthInfoService.encriptCodeVerifierToChallenge(body.code_verifier);
    const codeChallengeEncripted = this.oauthInfoService.encriptCodeChallengWithSalt(codeChallenge, body.code);

    //TODO: verificar secret da aplicação.
    //Coleta o usuário a partir do code challeng
    const userToken = await this.authService.findUserTokenByCodeChalleng(codeChallengeEncripted);
    const idToken = await this.authService.createIdToken(userToken.user, userToken.application.uuid);

    return {
      id_token: idToken,
      access_token: userToken.accessToken,
    };
  }

  @Get('.well-known/openid-configuration')
  async openIDConfig() {
    this.logger.log('OpenID Configuration');

    return {
      issuer: 'thalamus_iam',
      authorization_endpoint: iamConfig.HOST + '/auth/oauth2/authorize',
      token_endpoint: iamConfig.HOST + '/auth/oauth2/token',
      userinfo_endpoint: null,
      grant_types_supported: ['authorization_code'],
      response_types_supported: ['token', 'code', 'cookie'],
    };
  }
}
