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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const projects_interface_1 = require("../interfaces/projects.interface");
let UsersService = class UsersService {
    constructor(userModel, projectModel) {
        this.userModel = userModel;
        this.projectModel = projectModel;
    }
    async getProfile(userId) {
        try {
            const user = await this.userModel.findOne({ _id: userId });
            const projects = await this.projectModel.find({ userId: userId });
            const _a = user.toObject(), { password, keyExpires, resetPasswordKey } = _a, userToReturn = __rest(_a, ["password", "keyExpires", "resetPasswordKey"]);
            return { user: userToReturn, projects };
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async editProfile(editUser) {
        try {
            const user = await this.userModel.findOne({ _id: editUser.userId });
            if (editUser.firstName !== '')
                user.firstName = editUser.firstName;
            if (editUser.lastName !== '')
                user.lastName = editUser.lastName;
            if (editUser.bio !== '')
                user.bio = editUser.bio;
            user.save();
            const _a = user.toObject(), { password, keyExpires, resetPasswordKey } = _a, userToReturn = __rest(_a, ["password", "keyExpires", "resetPasswordKey"]);
            return { user: userToReturn };
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('User')),
    __param(1, mongoose_1.InjectModel('Project')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map