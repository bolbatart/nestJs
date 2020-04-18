import { Model } from 'mongoose';
import { IProject } from 'src/interfaces/projects.interface';
import { Request } from 'express';
import { ProjectDto } from 'src/projects/dto/create-project.dto';
import { EditProjectDto } from './dto/edit-project.dto';
export declare class ProjectsService {
    private readonly projectModel;
    constructor(projectModel: Model<IProject>);
    getFilteringParameters(): Promise<{
        areas: string[];
        availablePositions: string[];
        locations: string[];
    }>;
    getProjects(parameters: any): Promise<IProject>;
    getProjectById(projectId: string): Promise<IProject>;
    createProject(projectDto: ProjectDto, req: Request): Promise<IProject>;
    deleteProject(projectId: string): Promise<boolean>;
    editProject(editProjectDto: EditProjectDto, req: Request): Promise<IProject>;
    filters(): Promise<{
        locations: [string];
        areas: [string];
        professionalsNeeded: [string];
    }>;
    commentProject(projectId: string, userId: string, comment: string): Promise<IProject>;
    likeProject(projectId: string, userId: string): Promise<any>;
    dislikeProject(projectId: string, userId: string): Promise<any>;
}
