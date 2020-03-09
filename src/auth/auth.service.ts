import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { LoginDto } from 'src/auth/dto/login-user.dto';
import { Model } from 'mongoose';
import { IUser } from '../interfaces/users.interface';
import { RegisterDto } from 'src/auth/dto/register-user.dto';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>
  ) { }

  async register(registerDto: RegisterDto, res: Response): Promise<RegisterDto> {
    const exist = await this.userModel.findOne({ email: registerDto.email })
    if (exist) throw new HttpException('This email is already exists', HttpStatus.BAD_REQUEST);
    try {
      const createdUser = new this.userModel(registerDto);
      createdUser.password = this.hashPassword(createdUser.password);
      await this.createJwtCookies({ userId: createdUser.id }, res);
      await createdUser.save();
      const { password, ...userToReturn } = createdUser.toObject();
      return userToReturn;
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginDto: LoginDto, res: Response): Promise<LoginDto> {
    const hashedPassword = this.hashPassword(loginDto.password);
    const user = await this.userModel.findOne({ email: loginDto.email, password: hashedPassword })
    if (!user) throw new HttpException('Wrong email or password', HttpStatus.BAD_REQUEST) 
    try {
      await this.createJwtCookies({ userId: user.id }, res);
      const {password, ...userToReturn} = user.toObject();
      return userToReturn;
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async refreshTokens(oldRefreshToken: string, res: Response): Promise<{ message: string}> {
    try {
      const decodedToken = jwt.verify(oldRefreshToken, process.env.JWT_SECRET)
      await this.createJwtCookies({ userId: (decodedToken as any).userId }, res)
      return { message: 'Tokens have been updated'};
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  logout(res: Response): { message: string} {
    try {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return { message: 'Logged out'};
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  hashPassword(pass: string) {
    const sha512 = (password: string, salt: string) => {
      const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
      hash.update(password);
      const value = hash.digest('hex');
      return {
          salt:salt,
          passwordHash:value
      };
    }
    const passwordData = sha512(pass, process.env.PASSWORD_HASH_SECRET);
    return passwordData.passwordHash;
  }

  createJwtCookies(payload: {}, res: Response): void {
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
  }
  
}
