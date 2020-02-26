import { Controller, Post, UseGuards, Get, Delete, Put, Param, Req, Res, Body, HttpStatus } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request, Response } from 'express';
import { ProjectDto } from 'src/projects/dto/create-project.dto';
import { DeleteProjectDto } from './dto/delete-project.dto';
import { EditProjectDto } from './dto/edit-project.dto';
import { filterProjectDto } from './dto/filter-project.dto';



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
        try {
            const projects = await this.projectsService.getProjects(parametrs);
            return res.status(HttpStatus.OK).send(projects);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);    
        }
    }
    
    @Get(':id')
    async projectById(
        @Param('id') projectId: string,
        @Res() res: Response
        ): Promise<Response> {
        try {
            const project = await this.projectsService.getProjectById(projectId);
            return res.status(HttpStatus.OK).send(project);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);    
        }
    }
    
    // @Get()
    // @UseGuards(new AuthGuard)
    // async myProject(@Req() req: Request) {

    // }

    @Post('create')
    @UseGuards(new AuthGuard)
    async createProject(
        @Body() projectDto: ProjectDto,
        @Req() req: Request,
        @Res() res: Response
        ): Promise<Response> {
        try {
            const project = await this.projectsService.createProject(projectDto, req);
            return res.status(HttpStatus.OK).send(project);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
    }

    @Delete('delete')
    @UseGuards(new AuthGuard)
    async deleteProject(
        @Req() req: Request, 
        @Res() res: Response,
        @Body() deleteProjectDto: DeleteProjectDto
        ): Promise<Response> {
            try {
                await this.projectsService.deleteProject(deleteProjectDto); 
                return res.status(HttpStatus.OK).send('deleted...');
            } catch (error) {
                return res.status(HttpStatus.BAD_REQUEST).send(error);
            }
    }

    @Put('edit')
    @UseGuards(new AuthGuard)
    async editProject(
        @Req() req: Request,
        @Res() res: Response,
        @Body() editProjectDto: EditProjectDto
        ) {
        try {
            const editedProject = await this.projectsService.editProject(editProjectDto); 
            return res.status(HttpStatus.OK).send(editedProject);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).send(error);
        }
    }

}
