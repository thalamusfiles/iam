import { Injectable, Logger } from '@nestjs/common';
import cookieConfig from '../../../config/cookie.config';
import { RequestInfo } from '../../../commons/request-info';
import { ResponseInfo } from '../../../commons/response-info';
import { DateTime } from 'luxon';
import { CryptService } from './crypt.service';

@Injectable()
export class CookieService {
  private readonly logger = new Logger(CookieService.name);

  constructor(private readonly cryptService: CryptService) {
    this.logger.log('starting');
  }

  /**
   * Gera im cookie aleatório caso não exista
   * ou refresca a data de expiração do anterior.
   *
   * @param request
   * @param response
   */
  createOrRefreshSSOCookie(request: RequestInfo, response: ResponseInfo, force = false): string {
    this.logger.verbose('createOrRefreshSSOCookie');

    let cookieValue = this.getSSOCookie(request);
    if (!cookieValue || force) {
      const sessionValue = this.cryptService.generateRandomString(128);
      const sessionHash = this.cryptService.encrypt(sessionValue, sessionValue, cookieConfig.SECRET);

      cookieValue = `${sessionValue}${sessionHash}`;
    }

    this.refreshSSOCookie(response, cookieValue);

    return cookieValue;
  }

  private refreshSSOCookie(response: ResponseInfo, value: string): void {
    this.logger.verbose('refreshSSOCookie');

    const expires = DateTime.now().plus({ seconds: cookieConfig.MAX_AGE }).toJSDate();

    response.cookie(cookieConfig.NAME, value, {
      httpOnly: true,
      path: cookieConfig.PATH,
      expires: expires,
    });
  }

  getSSOCookie(request: RequestInfo): string {
    this.logger.verbose('getSSOCookie');

    return request.cookies?.iam_sso;
  }

  clearCookies(response: ResponseInfo): void {
    response.clearCookie(cookieConfig.NAME);
  }
}
