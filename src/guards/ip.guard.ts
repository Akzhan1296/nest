import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { BlockIpsService } from '../features/ips/application/ips.service';
import { BlockIpsQueryRepository } from '../features/ips/infrastructure/ips.query.repository';

@Injectable()
export class BlockIpGuard implements CanActivate {
  constructor(
    private readonly blockIpQueryRepository: BlockIpsQueryRepository,
    private readonly blockIpsService: BlockIpsService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const ip =
      request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    const path = request.path;
    const dateZero = new Date().getTime() - 10000;
    const date = new Date().getTime();
    let ipData = null;

    const isDataSaved = await this.blockIpsService.addIpData({
      ip: ip as string,
      path,
      date,
    });

    if (isDataSaved) {
      ipData = await this.blockIpQueryRepository.findIp(
        ip as string,
        path,
        dateZero,
        date,
      );
    }

    if (ipData && ipData.length > 5) {
      throw new HttpException('ip blocked', HttpStatus.TOO_MANY_REQUESTS);
    } else {
      return true;
    }
  }
}
