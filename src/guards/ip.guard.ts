import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import { BlockIpsService } from '../features/ips/application/ips.service';
import { BlockIpsQueryRepository } from '../features/ips/infrastructure/ips.query.repository';

@Injectable()
export class BlockIpGuard implements CanActivate {
  constructor(
    private blockIpQueryRepository: BlockIpsQueryRepository,
    private blockIpsService: BlockIpsService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

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
      response.sendStatus(429);
      return false;
    } else {
      return true;
    }
  }
}
