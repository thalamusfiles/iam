import { Body, Controller, Delete, Post, Get, Logger, Param, Req, UseGuards, Ip, Headers } from '@nestjs/common';
import { RequestInfo } from '../../../commons/request-info';
import { AccessGuard } from '../../auth/passaport/access.guard';
import { TokenService } from '../service/token.service';
import { TokenInfo, TokenPermanentDto } from './dto/token.dto';
import { AuthService } from '../../auth/service/auth.service';

@UseGuards(AccessGuard)
@Controller('iam/token')
export class TokenController {
  private readonly logger = new Logger(TokenController.name);

  constructor(
    //
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
  ) {
    this.logger.log('starting');
  }

  @Get()
  async find(@Req() request: RequestInfo): Promise<TokenInfo[]> {
    this.logger.log('find');

    const userUuid = request.user.sub;
    return await this.tokenService.findAll(userUuid, 0, 1000);
  }

  @Get('active')
  async active(@Req() request: RequestInfo): Promise<TokenInfo[]> {
    this.logger.log('active');

    const userUuid = request.user.sub;
    return await this.tokenService.activeTokensByUser(userUuid);
  }

  @Post()
  async createOrEditPermanent(
    @Body() body: TokenPermanentDto,
    @Req() request: RequestInfo,
    @Headers('User-Agent') userAgent,
    @Ip() ip: string,
  ): Promise<TokenPermanentDto> {
    this.logger.log('newPermanent');

    const user = request.user;
    const accessToken = this.authService.createAccessToken(user, null);

    const loginInfo = this.authService.startLoginInfo({
      userAgent,
      ip,
      userUuid: user.sub,
      scope: body.scope,
      accessToken,
    });
    await this.authService.saveUserToken(loginInfo);

    return {
      name: '',
      scope: body.scope,
      accessToken,
    };
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string, @Req() request: RequestInfo): Promise<void> {
    this.logger.log('delete');

    const userUuid = request.user.sub;
    return await this.tokenService.delete(userUuid, uuid);
  }
}
