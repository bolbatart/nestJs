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
        
    @Get('filter-parameters')
    async getFilteringParameters(
        @Req() req: Request,
        @Res() res: Response
        ): Promise<Response> {
        return res.send(await this.projectsService.getFilteringParameters());
    }

    @Get()
    async projects(
        @Req() req: Request,
        @Res() res: Response
        ): Promise<Response> {
        return res.send(await this.projectsService.getProjects({}));
    }

    @Get(':area/:availablePosition/:location/:name')
    async filteredProjects(
        @Req() req: Request,
        @Res() res: Response,
        @Param('area') area: string,
        @Param('availablePosition') availablePosition: string,
        @Param('location') location: string,
        @Param('name') name: string,
        ): Promise<Response> {
        return res.send(await this.projectsService.getProjects({area, availablePosition, location, name}));
    }
        
    @Get('filters')
    async filters(
        @Res() res: Response
        ): Promise<Response> {
        return res.send(await this.projectsService.filters());
    }

    @Get(':id')
    async projectById(
        @Param('id') projectId: string,
        @Res() res: Response
    ): Promise<Response> {
    return res.send(await this.projectsService.getProjectById(projectId));
}
    
    @Post('create')
    @UseGuards(new AuthGuard)
    async createProject(
        @Req() req: Request,
        @Res() res: Response,
        @Body() projectDto: ProjectDto
        // param userids
        ): Promise<Response> {
        return res.send(await this.projectsService.createProject(projectDto, req));
    }

    @Delete('delete/:id')
    @UseGuards(new AuthGuard)
    async deleteProject(
        @Req() req: Request, 
        @Res() res: Response,
        @Param('id') projectId: string
        // @Body() deleteProjectDto: DeleteProjectDto
        ): Promise<Response> {
        await this.projectsService.deleteProject(projectId); 
        return res.send('deleted...');
    }

    @Put('edit')
    @UseGuards(new AuthGuard)
    async editProject(
        @Req() req: Request,
        @Res() res: Response,
        @Body() editProjectDto: EditProjectDto
        ): Promise<Response> {
        return res.send(await this.projectsService.editProject(editProjectDto, req));
    }


}
