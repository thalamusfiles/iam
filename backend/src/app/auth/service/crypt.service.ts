import { createHmac, randomBytes } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CryptService {
  private readonly logger = new Logger(CryptService.name);

  constructor() {
    this.logger.log('starting');
  }

  /**
   * Gera o Hash da senha a partir de 2 salt e a senha, um aleatório gerado no cadastro e outro fixo e secreto.
   * @param salt
   * @param password
   * @returns
   */
  public encrypt(secret: string, salt: string, password: string): string {
    const hash = createHmac('sha512', salt + secret);
    hash.update(password);
    return hash.digest('hex');
  }

  /**
   * Gera um valor aleatório para ser utilizado como "salt" de senha.
   * @param length
   * @returns
   */
  public generateRandomString(length: number): string {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }
}
