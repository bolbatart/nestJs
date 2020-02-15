import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { LoginDto } from 'src/users/dto/login-user.dto';
import { Model } from 'mongoose';
import { IUser } from '../users/interfaces/users.interface';
import { RegisterDto } from 'src/users/dto/register-user.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>
  ) {}

  async register(registerDto: RegisterDto, req: any): Promise<any> {
    const exist = await this.userModel.findOne({ email: registerDto.email })
    if (exist) throw new HttpException('This email is already exists', HttpStatus.BAD_REQUEST)
    const createdUser = new this.userModel(registerDto);
    await createdUser.save();
    return this.generateTokens({ email: createdUser.email, userId: createdUser.id });
  }

  async login(loginDto: LoginDto, req: any): Promise<any> {
    const user = await this.userModel.findOne({ email: loginDto.email, password: loginDto.password })
    if (!user) throw new HttpException('Wrong email or password', HttpStatus.BAD_REQUEST) 
    return this.generateTokens({ email: user.email, userId: user.id })
  }

  async generateTokens(payload: {}) {
    const accessToken = sign(payload, 'secret', { expiresIn: '60s' })
    const refreshToken = sign(payload, 'secret', { expiresIn: '1d' })
    return { accessToken, refreshToken };
  }

  async addCookies(req: any, tokens: any) {
    return [
      {
          name: 'accessToken',
          value: tokens.accessToken,
          options: {
              httpOnly: true,
              secure: false,
              maxAge: 600000, // 10m
          },
      },
      {
          name: 'refresToken',
          value: tokens.refreshToken,
          options: {
              httpOnly: true,
              secure: false,
              maxAge: 86400000, // 1d
          },
      }

  ];
  }
  
}
