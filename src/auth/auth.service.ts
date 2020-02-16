import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { LoginDto } from 'src/users/dto/login-user.dto';
import { Model } from 'mongoose';
import { IUser } from '../users/interfaces/users.interface';
import { RegisterDto } from 'src/users/dto/register-user.dto';
import { bcrypt } from 'bcrypt';
import * as crypto from 'crypto';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    const exist = await this.userModel.findOne({ email: registerDto.email })
    if (exist) throw new HttpException('This email is already exists', HttpStatus.BAD_REQUEST)
    const createdUser = new this.userModel(registerDto);
    createdUser.password = this.hashPassword(createdUser.password);
    await createdUser.save();
    return this.generateTokens({ userId: createdUser.id });
  }

  async login(loginDto: LoginDto): Promise<any> {
    const hashedPassword = this.hashPassword(loginDto.password);
    const user = await this.userModel.findOne({ email: loginDto.email, password: hashedPassword })
    if (!user) throw new HttpException('Wrong email or password', HttpStatus.BAD_REQUEST) 
    return this.generateTokens({ userId: user.id })
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

    const passwordData = sha512(pass, 'secret');
    return passwordData.passwordHash;
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
