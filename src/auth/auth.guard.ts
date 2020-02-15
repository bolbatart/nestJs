import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(req: any) {
        // check for a cookies
        const cookies = req.cookies;
        if (!cookies) throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED); 
        // validate tokens
        const accessToken = cookies.accessToken;
        const payloadAT = await jwt.verify(accessToken, 'secret'); 
        req.user = payloadAT;
        return true;
    }
}