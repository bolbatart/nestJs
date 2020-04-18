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
const mongoose_2 = require("mongoose");
const projects_interface_1 = require("../interfaces/projects.interface");
const create_project_dto_1 = require("./dto/create-project.dto");
const jwt = require("jsonwebtoken");
let ProjectsService = class ProjectsService {
    constructor(projectModel) {
        this.projectModel = projectModel;
    }
    async getFilteringParameters() {
        let parameters = {
            areas: [],
            availablePositions: [],
            locations: []
        };
        await this.projectModel.find().distinct('professionalsNeeded', (err, profs) => {
            profs.forEach(prof => parameters.availablePositions.push(prof));
        });
        await this.projectModel.find().distinct('area', (err, areas) => {
            areas.forEach(area => parameters.areas.push(area));
        });
        await this.projectModel.find().distinct('location', (err, locations) => {
            locations.forEach(location => parameters.locations.push(location));
        });
        return parameters;
    }
    async getProjects(parameters) {
        try {
            if (parameters.location === undefined || parameters.location === "any")
                parameters.location = { $type: 2 };
            if (parameters.area === undefined || parameters.area === "any")
                parameters.area = { $type: 2 };
            if (parameters.availablePosition === undefined || parameters.availablePosition === "any")
                parameters.availablePosition = { $type: 2 };
            if (parameters.name === undefined || parameters.name === "any")
                parameters.name = { $type: 2 };
            else
                parameters.name = { $regex: parameters.name };
            const projects = await this.projectModel.find({
                location: parameters.location,
                professionalsNeeded: parameters.availablePosition,
                area: parameters.area,
                name: parameters.name
            });
            return projects;
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getProjectById(projectId) {
        try {
            const project = await this.projectModel.findOne({ _id: projectId });
            return project;
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createProject(projectDto, req) {
        try {
            projectDto.userId = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET).userId;
            const createdProject = new this.projectModel(projectDto);
            await createdProject.save();
            const _a = createdProject.toObject(), { userId, description } = _a, projectToReturn = __rest(_a, ["userId", "description"]);
            return projectToReturn;
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteProject(projectId) {
        try {
            await this.projectModel.findOneAndDelete({ _id: projectId });
            return true;
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async editProject(editProjectDto, req) {
        try {
            const usrId = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET).userId;
            const edited = await this.projectModel.findOneAndUpdate({ _id: editProjectDto.projectId, userId: usrId }, editProjectDto, { new: true });
            const _a = edited.toObject(), { userId, description } = _a, projectToReturn = __rest(_a, ["userId", "description"]);
            return projectToReturn;
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async filters() {
        try {
            const locations = await this.projectModel.distinct('location');
            const areas = await this.projectModel.distinct('area');
            const professionalsNeeded = await this.projectModel.distinct('professionalsNeeded');
            return { locations, areas, professionalsNeeded };
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async commentProject(projectId, userId, comment) {
        try {
            const project = await this.projectModel.findOne({ _id: projectId });
            if (!project.comments) {
                project.comments = [{ userId, comment }];
            }
            else
                project.comments.push({ userId, comment });
            await project.save();
            return project;
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async likeProject(projectId, userId) {
        try {
            const project = await this.projectModel.findOne({ _id: projectId });
            if (project.like.includes(userId))
                project.like.splice(project.like.indexOf(userId), 1);
            else {
                project.like ? project.like.push(userId) : project.like = [userId];
                if (project.dislike.includes(userId))
                    project.dislike.splice(project.dislike.indexOf(userId), 1);
            }
            await project.save();
            return project;
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async dislikeProject(projectId, userId) {
        try {
            const project = await this.projectModel.findOne({ _id: projectId });
            if (project.dislike.includes(userId))
                project.dislike.splice(project.dislike.indexOf(userId), 1);
            else {
                project.dislike ? project.dislike.push(userId) : project.dislike = [userId];
                if (project.like.includes(userId))
                    project.like.splice(project.like.indexOf(userId), 1);
            }
            await project.save();
            return project;
        }
        catch (err) {
            const message = 'Server error: ' + (err.message || err.name);
            throw new common_1.HttpException(message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
ProjectsService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Project')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ProjectsService);
exports.ProjectsService = ProjectsService;
//# sourceMappingURL=projects.service.js.map