import { Controller, Post, UseGuards, Get, Delete, Put, Param, Req, Res, Body, HttpStatus } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request, Response } from 'express';
import { ProjectDto } from 'src/projects/dto/create-project.dto';
import { DeleteProjectDto } from './dto/delete-project.dto';
import { EditProjectDto } from './dto/edit-project.dto';
import { filterProjectDto } from './dto/filter-project.dto';
import * as jwt from 'jsonwebtoken';



@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
    ){}

    @Get()
    async projects(
        @Req() req: Request,
        @Res() res: Response,
        @Body() parametrs: filterProjectDto
        ): Promise<Response> {
        const projects = await this.projectsService.getProjects(parametrs);
        return res.status(HttpStatus.OK).send(projects);
    }
    
    @Get(':id')
    async projectById(
        @Param('id') projectId: string,
        @Res() res: Response
        ): Promise<Response> {
        const project = await this.projectsService.getProjectById(projectId);
        return res.status(HttpStatus.OK).send(project);
    }
    
    @Post('create')
    @UseGuards(new AuthGuard)
    async createProject(
        @Body() projectDto: ProjectDto,
        @Req() req: Request,
        @Res() res: Response
        ): Promise<Response> {
        const project = await this.projectsService.createProject(projectDto, req);
        return res.status(HttpStatus.OK).send(project);
    }

    @Delete('delete')
    @UseGuards(new AuthGuard)
    async deleteProject(
        @Req() req: Request, 
        @Res() res: Response,
        @Body() deleteProjectDto: DeleteProjectDto
        ): Promise<Response> {
        await this.projectsService.deleteProject(deleteProjectDto); 
        return res.status(HttpStatus.OK).send('deleted...');
    }

    @Put('edit')
    @UseGuards(new AuthGuard)
    async editProject(
        @Req() req: Request,
        @Res() res: Response,
        @Body() editProjectDto: EditProjectDto
        ) {
        const project = await this.projectsService.editProject(editProjectDto, req); 
        return res.status(HttpStatus.OK).send(project);
    }

}
