import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { LoginDto } from 'src/users/dto/login-user.dto';
import { Model } from 'mongoose';
import { IUser } from '../users/interfaces/users.interface';
import { RegisterDto } from 'src/users/dto/register-user.dto';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>
  ) {}

  async register(registerDto: RegisterDto, res: Response): Promise<Response> {
    const exist = await this.userModel.findOne({ email: registerDto.email })
    if (exist) throw new HttpException('This email is already exists', HttpStatus.BAD_REQUEST);
    const createdUser = new this.userModel(registerDto);
    createdUser.password = this.hashPassword(createdUser.password);
    try {
      const resWithCookies = this.createJwtCookies({ userId: createdUser.id }, res);
      await createdUser.save();
      return resWithCookies;
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginDto: LoginDto, res: Response): Promise<Response> {
    const hashedPassword = this.hashPassword(loginDto.password);
    const user = await this.userModel.findOne({ email: loginDto.email, password: hashedPassword })
    if (!user) throw new HttpException('Wrong email or password', HttpStatus.BAD_REQUEST) 
    const resWithCookies = this.createJwtCookies({ userId: user.id }, res);
    return resWithCookies;
  }

  refreshTokens(oldRefreshToken: string, res: Response): Response {
    const decodedToken = jwt.verify(oldRefreshToken, process.env.JWT_SECRET)
    const resWithCookies = this.createJwtCookies({ userId: (<any>decodedToken).userId }, res)
    return resWithCookies;
  }


  hashPassword(pass): string {
    const sha512 = (password, salt) => {
      let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
      hash.update(password);
      let value = hash.digest('hex');
      return {
          salt:salt,
          passwordHash:value
      };
    }

    const passwordData = sha512(pass, process.env.PASSWORD_HASH_SECRET);
    return passwordData.passwordHash;
  }

  createJwtCookies(payload: {}, res: Response): Response {
    try {
      const accessToken = sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.AT_EXPIRES })
      const refreshToken = sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.RT_EXPIRES })
      res.cookie('accessToken', accessToken, {
        maxAge: Number(process.env.COOKIE_AT_MAXAGE),
        httpOnly: true,
        secure: false,
      });
      res.cookie('refreshToken', refreshToken, {
        maxAge: Number(process.env.COOKIE_RT_MAXAGE),
        httpOnly: true,
        secure: false,
      });
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}
