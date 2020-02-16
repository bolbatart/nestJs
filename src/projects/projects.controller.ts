import { Controller, Post, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
    ){}

    
    @Post('add')
    @UseGuards(new AuthGuard)
    async addProject() {
        return { message: 'project added'}
    }
}
