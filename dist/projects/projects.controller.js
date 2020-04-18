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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const auth_guard_1 = require("../auth/auth.guard");
const create_project_dto_1 = require("./dto/create-project.dto");
const edit_project_dto_1 = require("./dto/edit-project.dto");
const comment_project_dto_1 = require("./dto/comment-project.dto");
const jwt = require("jsonwebtoken");
let ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    async getFilteringParameters(req, res) {
        return res.send(await this.projectsService.getFilteringParameters());
    }
    async projects(req, res) {
        return res.send(await this.projectsService.getProjects({}));
    }
    async filteredProjects(req, res, area, availablePosition, location, name) {
        return res.send(await this.projectsService.getProjects({ area, availablePosition, location, name }));
    }
    async filters(res) {
        return res.send(await this.projectsService.filters());
    }
    async projectById(projectId, res) {
        return res.send(await this.projectsService.getProjectById(projectId));
    }
    async createProject(req, res, projectDto) {
        return res.send(await this.projectsService.createProject(projectDto, req));
    }
    async deleteProject(req, res, projectId) {
        await this.projectsService.deleteProject(projectId);
        return res.send('deleted...');
    }
    async editProject(req, res, editProjectDto) {
        return res.send(await this.projectsService.editProject(editProjectDto, req));
    }
    async commentProject(req, res, projectId, commentProjectDto) {
        const usrId = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET).userId;
        return res.send(await this.projectsService.commentProject(projectId, usrId, commentProjectDto.comment));
    }
    async likeProject(req, res, projectId) {
        const userId = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET).userId;
        return res.send(await this.projectsService.likeProject(projectId, userId));
    }
    async dislikeProject(req, res, projectId) {
        const userId = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET).userId;
        return res.send(await this.projectsService.dislikeProject(projectId, userId));
    }
};
__decorate([
    common_1.Get('filter-parameters'),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "getFilteringParameters", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "projects", null);
__decorate([
    common_1.Get(':area/:availablePosition/:location/:name'),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Param('area')),
    __param(3, common_1.Param('availablePosition')),
    __param(4, common_1.Param('location')),
    __param(5, common_1.Param('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "filteredProjects", null);
__decorate([
    common_1.Get('filters'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "filters", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "projectById", null);
__decorate([
    common_1.Post('create'),
    common_1.UseGuards(new auth_guard_1.AuthGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_project_dto_1.ProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "createProject", null);
__decorate([
    common_1.Delete('delete/:id'),
    common_1.UseGuards(new auth_guard_1.AuthGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "deleteProject", null);
__decorate([
    common_1.Put('edit'),
    common_1.UseGuards(new auth_guard_1.AuthGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, edit_project_dto_1.EditProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "editProject", null);
__decorate([
    common_1.Post(':id/comment'),
    common_1.UseGuards(new auth_guard_1.AuthGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Param('id')),
    __param(3, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, comment_project_dto_1.CommentProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "commentProject", null);
__decorate([
    common_1.Put(':id/like'),
    common_1.UseGuards(new auth_guard_1.AuthGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "likeProject", null);
__decorate([
    common_1.Put(':id/dislike'),
    common_1.UseGuards(new auth_guard_1.AuthGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "dislikeProject", null);
ProjectsController = __decorate([
    common_1.Controller('projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
exports.ProjectsController = ProjectsController;
//# sourceMappingURL=projects.controller.js.map