import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { RequestInfo } from '../../../commons/request-info';
import { AccessGuard } from '../../auth/passaport/access.guard';
import { UserInfo, UserService } from '../service/user.service';

@UseGuards(AccessGuard)
@Controller('iam/me')
export class MeController {
  private readonly logger = new Logger(MeController.name);

  constructor(private readonly userService: UserService) {
    this.logger.log('starting');
  }

  @Get()
  async me(@Req() request: RequestInfo): Promise<UserInfo> {
    this.logger.log('me');

    const uuid = request.user.sub;
    return await this.userService.userInfo(uuid);
  }
}
