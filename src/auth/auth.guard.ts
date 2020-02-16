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
        const cookies = req.cookies;
        if (!cookies) throw new HttpException('Unathorized', HttpStatus.UNAUTHORIZED); 
        try {
            const accessToken = cookies.accessToken;
            const payloadAT = await jwt.verify(accessToken, process.env.JWT_SECRET); 
            req.user = payloadAT;
            return true;
        } catch (err) {
            const message = 'Token error: ' + (err.message || err.name);
            throw new HttpException(message, HttpStatus.UNAUTHORIZED);
        }
        
    }
}