import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { LoginDto } from 'src/users/dto/login-user.dto';
import { Model } from 'mongoose';
import { IUser } from '../users/interfaces/users.interface';
import { RegisterDto } from 'src/users/dto/register-user.dto';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const exist = await this.userModel.findOne({ email: registerDto.email })
    if (exist) throw new HttpException('This email is already exists', HttpStatus.BAD_REQUEST);
    const createdUser = new this.userModel(registerDto);
    createdUser.password = this.hashPassword(createdUser.password);
    try {
      const tokens = await this.generateTokens({ userId: createdUser.id });
      await createdUser.save();
      return tokens;
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginDto: LoginDto): Promise<any> {
    const hashedPassword = this.hashPassword(loginDto.password);
    const user = await this.userModel.findOne({ email: loginDto.email, password: hashedPassword })
    if (!user) throw new HttpException('Wrong email or password', HttpStatus.BAD_REQUEST) 
    return this.generateTokens({ userId: user.id })
  }

  async refreshTokens(oldRefreshToken: string): Promise<any> {
    const payload = jwt.verify(oldRefreshToken, process.env.JWT_SECRET);
    return payload;
  }


  hashPassword(pass) {
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

  async generateTokens(payload: {}) {
    const accessToken = sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.AT_EXPIRES })
    const refreshToken = sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.RT_EXPIRES })
    return { accessToken, refreshToken };
  }

  async addCookies(tokens: any) {
    return [
      {
          name: 'accessToken',
          value: tokens.accessToken,
          options: {
              httpOnly: true,
              secure: false,
              maxAge: process.env.COOKIE_AT_MAXAGE, // 10m
          },
      },
      {
          name: 'refreshToken',
          value: tokens.refreshToken,
          options: {
              httpOnly: true,
              secure: false,
              maxAge: process.env.COOKIE_RT_MAXAGE, // 1d
          },
      }

  ];
  }
  
}
