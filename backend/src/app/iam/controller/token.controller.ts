import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
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

  @Get('active')
  async active(@Req() request: RequestInfo): Promise<TokenInfo[]> {
    const uuid = request.user.uuid;
    return await this.userService.activeTokensByUser(uuid);
  }
}
