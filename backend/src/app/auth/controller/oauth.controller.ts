import { Controller, Get, Logger, Query, Req, Res, UsePipes } from '@nestjs/common';
import { FormException } from '../../../commons/form.exception';
import { Throttle } from '@nestjs/throttler';
import iamConfig from '../../../config/iam.config';
import { RequestInfo } from '../../../commons/request-info';
import { CookieService } from '../service/cookie.service';
import { AuthOauthFieldsUseCase } from '../usecase/auth-oauth-fields.usecase';
import { AuthLoginClientIdUseCase } from '../usecase/auth-register-client_id.usecase';
import { ApplicationInfoDto, OauthFieldsDto, ScopeInfoDto } from './dto/auth.dto';
import { OauthInfoService } from '../service/oauthinfo.service';
import { IamValidationPipe } from '../../../commons/validation.pipe';

@Controller('auth')
export class OauthController {
  private readonly logger = new Logger(OauthController.name);

  constructor(
    private readonly cookieService: CookieService,
    private readonly oauthInfoService: OauthInfoService,
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
  async oauth2Authorize(@Req() request: RequestInfo, @Res() res, @Query() query: OauthFieldsDto): Promise<any> {
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
      let code = null;
      if (query.code_challenge) {
        code = this.oauthInfoService.generateAuthorizationCode();
        query.code_challenge = this.oauthInfoService.encriptCodeChallengWithSalt(query.code_challenge, code);
      }

      const redirectUri = this.oauthInfoService.createCallbackUri(query.redirect_uri, query.response_type, query.state, code);
      return res.redirect(redirectUri);
    } else {
      const baseUrl = `/public/app/${query.client_id}/login`;
      const params = this.oauthInfoService.createOauthParams(query);

      return res.redirect(baseUrl + '?' + params);
    }
  }

  @Get('oauth2/token')
  @Throttle(iamConfig.REGISTER_RATE_LIMITE, iamConfig.REGISTER_RATE_LIMITE_RESET_TIME)
  async oauth2Token(@Req() request: RequestInfo): Promise<string> {
    this.logger.log('Oauth2 token');

    return '' + request;
  }

  @Get('.well-known/openid-configuration')
  async openIDConfig() {
    this.logger.log('OpenID Configuration');
    return {
      issuer: 'thalamus_iam',
      authorization_endpoint: '/auth/oauth2/authorize',
      token_endpoint: '/auth/oauth2/token',
      userinfo_endpoint: null,
      grant_types_supported: ['authorization_code'],
      response_types_supported: ['token', 'code', 'cookie'],
    };
  }
}
