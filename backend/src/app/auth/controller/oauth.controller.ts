import { Body, Controller, Get, Logger, Query, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormException } from '../../../commons/form.exception';
import { Throttle } from '@nestjs/throttler';
import iamConfig from '../../../config/iam.config';
import { RequestInfo } from '../../../commons/request-info';
import { CookieService } from '../service/cookie.service';
import { AuthOauthFieldsUseCase } from '../usecase/auth-oauth-fields.usecase';
import { AuthLoginClientIdUseCase } from '../usecase/auth-register-client_id.usecase';
import { ApplicationInfoDto, AuthRegisterDto } from './dto/auth.dto';
import { OauthInfoService } from '../service/oauthinfo.service';

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
  @UsePipes(new ValidationPipe({ transform: true }))
  async applicationInfo(@Query() query?: ApplicationInfoDto): Promise<{ uuid: string; name: string }> {
    this.logger.log('Registro Local de Usuários');

    const { uuid, name } = await this.oauthInfoService.findApplication(query.uuid);
    return { uuid, name };
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
