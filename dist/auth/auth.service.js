"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jsonwebtoken_1 = require("jsonwebtoken");
const login_user_dto_1 = require("./dto/login-user.dto");
const mongoose_2 = require("mongoose");
const register_user_dto_1 = require("./dto/register-user.dto");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const uuid_1 = require("uuid");
const nodemailer = require("nodemailer");
let AuthService = class AuthService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async register(registerDto, res) {
        const exist = await this.userModel.findOne({ email: registerDto.email });
        if (exist)
            throw new common_1.HttpException('This email is already exists', common_1.HttpStatus.BAD_REQUEST);
        try {
            const createdUser = new this.userModel(registerDto);
            createdUser.password = this.hashPassword(createdUser.password);
            await this.createJwtCookies({ userId: createdUser.id }, res);
            await createdUser.save();
            const _a = createdUser.toObject(), { password } = _a, userToReturn = __rest(_a, ["password"]);
            return userToReturn;
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async login(loginDto, res) {
        const hashedPassword = this.hashPassword(loginDto.password);
        const user = await this.userModel.findOne({ email: loginDto.email, password: hashedPassword });
        if (!user)
            throw new common_1.HttpException('Wrong email or password', common_1.HttpStatus.BAD_REQUEST);
        try {
            await this.createJwtCookies({ userId: user.id }, res);
            const _a = user.toObject(), { password } = _a, userToReturn = __rest(_a, ["password"]);
            return userToReturn;
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async refreshTokens(oldRefreshToken, res) {
        try {
            const decodedToken = jwt.verify(oldRefreshToken, process.env.JWT_SECRET);
            await this.createJwtCookies({ userId: decodedToken.userId }, res);
            return { message: 'Tokens have been updated' };
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.userModel.findOne({ email: forgotPasswordDto.email });
        if (!user)
            throw new common_1.HttpException('Wrong email', common_1.HttpStatus.BAD_REQUEST);
        try {
            const resetPasswordKey = uuid_1.v4();
            user.resetPasswordKey = resetPasswordKey;
            user.keyExpires = Date.now() + 3600000;
            user.save();
            this.sendLinkToEmail(resetPasswordKey, forgotPasswordDto.email);
            return { message: 'Success...' };
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetPassword(resetPasswordDto, key) {
        try {
            console.log(key);
            const user = await this.userModel.findOne({ resetPasswordKey: key });
            if (!user || user.keyExpires < Date.now()) {
                throw new common_1.HttpException('Please send your email address to us again', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            user.password = this.hashPassword(resetPasswordDto.password);
            user.save();
            return { message: 'Success...' };
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    sendLinkToEmail(key, email) {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'artiombolbat123@gmail.com',
                pass: process.env.GMAILPW
            }
        });
        let mailOptions = {
            to: 'artiombolbat123@gmail.com',
            from: 'artiombolbat123@gmail.com',
            subject: 'Password reset',
            text: 'http://localhost:4200/reset/' + key
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err);
            else
                console.log(info);
        });
    }
    logout(res) {
        try {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return { message: 'Logged out' };
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    hashPassword(pass) {
        const sha512 = (password, salt) => {
            const hash = crypto.createHmac('sha512', salt);
            hash.update(password);
            const value = hash.digest('hex');
            return {
                salt: salt,
                passwordHash: value
            };
        };
        const passwordData = sha512(pass, process.env.PASSWORD_HASH_SECRET);
        return passwordData.passwordHash;
    }
    createJwtCookies(payload, res) {
        const accessToken = jsonwebtoken_1.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.AT_EXPIRES });
        const refreshToken = jsonwebtoken_1.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.RT_EXPIRES });
        res.cookie('accessToken', accessToken, {
            maxAge: Number(process.env.COOKIE_AT_MAXAGE),
            secure: false,
        });
        res.cookie('refreshToken', refreshToken, {
            maxAge: Number(process.env.COOKIE_RT_MAXAGE),
            secure: false,
        });
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('User')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map