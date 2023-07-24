import { Controller, Delete, Get, Logger, Param, Req, UseGuards } from '@nestjs/common';
import { RequestInfo } from '../../../commons/request-info';
import { AccessGuard } from '../../auth/passaport/access.guard';
import { TokenInfo, TokenService } from '../service/token.service';

@UseGuards(AccessGuard)
@Controller('iam/token')
export class TokenController {
  private readonly logger = new Logger(TokenController.name);

  constructor(private readonly userService: TokenService) {
    this.logger.log('starting');
  }

  @Get()
  async findAll(@Req() request: RequestInfo): Promise<TokenInfo[]> {
    const userUuid = request.user.sub;
    return await this.userService.findAll(userUuid, 0, 1000);
  }

  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string, @Req() request: RequestInfo): Promise<void> {
    const userUuid = request.user.sub;
    return await this.userService.delete(userUuid, uuid);
  }

  @Get('active')
  async active(@Req() request: RequestInfo): Promise<TokenInfo[]> {
    const userUuid = request.user.sub;
    return await this.userService.activeTokensByUser(userUuid);
  }
}
