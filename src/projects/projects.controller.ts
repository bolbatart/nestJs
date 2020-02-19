import { Controller, Post, UseGuards, Get, Request, Delete, Put, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
    ){}

    @Get()
    async projects(@Request() req) {

    }

    @Get(':id')
    async projectById(@Param() projectId) {
        
    }

    @Get()
    @UseGuards(new AuthGuard)
    async myProject(@Request() req) {
        
    }

    @Post('create')
    @UseGuards(new AuthGuard)
    async createProject(@Request() req) {
        const project = req.body;
        
    }

    @Delete('delete')
    @UseGuards(new AuthGuard)
    async deleteProject(@Request() req) {

    }

    @Put('edit')
    @UseGuards(new AuthGuard)
    async editProject(@Request() req) {

    }

}
