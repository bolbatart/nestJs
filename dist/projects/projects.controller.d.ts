import { ProjectsService } from './projects.service';
import { Request, Response } from 'express';
import { ProjectDto } from 'src/projects/dto/create-project.dto';
import { EditProjectDto } from './dto/edit-project.dto';
import { CommentProjectDto } from './dto/comment-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    getFilteringParameters(req: Request, res: Response): Promise<Response>;
    projects(req: Request, res: Response): Promise<Response>;
    filteredProjects(req: Request, res: Response, area: string, availablePosition: string, location: string, name: string): Promise<Response>;
    filters(res: Response): Promise<Response>;
    projectById(projectId: string, res: Response): Promise<Response>;
    createProject(req: Request, res: Response, projectDto: ProjectDto): Promise<Response>;
    deleteProject(req: Request, res: Response, projectId: string): Promise<Response>;
    editProject(req: Request, res: Response, editProjectDto: EditProjectDto): Promise<Response>;
    commentProject(req: Request, res: Response, projectId: string, commentProjectDto: CommentProjectDto): Promise<Response>;
    likeProject(req: Request, res: Response, projectId: string): Promise<Response>;
    dislikeProject(req: Request, res: Response, projectId: string): Promise<Response>;
}
