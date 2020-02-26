import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProject } from 'src/interfaces/projects.interface';
import { Response, Request } from 'express'; 
import { ProjectDto } from 'src/projects/dto/create-project.dto';
import * as jwt from 'jsonwebtoken';
import { DeleteProjectDto } from './dto/delete-project.dto';
import { EditProjectDto } from './dto/edit-project.dto';
import { filterProjectDto } from './dto/filter-project.dto';


@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<IProject>
  ) { }

  // stuff(a = "any") {

  // }

  async getProjects(parameters: filterProjectDto) {
    Object.keys(parameters).forEach( key => {
      if (parameters[key] === 'any') {
        parameters[key] = { $type: 2 };
      } else if (key != 'location') {
        parameters[key] = { $in: parameters[key] };
      }
    });
    const projects = await this.projectModel.find({ 
      location: parameters.location,
      professionalsNeeded: parameters.availablePositions,
      area: parameters.area
    });
    return projects;
  }

  async getProjectById(projectId: string): Promise<IProject> {
    let project: IProject = await this.projectModel.findOne({ _id: projectId});
    return project;
  }

  async createProject(projectDto: ProjectDto, req: Request): Promise<IProject> {
    projectDto.userId = await (<any>jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET)).userId;
    const createdProject = new this.projectModel(projectDto);
    await createdProject.save();
    return createdProject;
  }

  async deleteProject(deleteProjectDto: DeleteProjectDto): Promise<boolean> {
    await this.projectModel.findOneAndRemove({ _id: deleteProjectDto.projectId });
    return true;
  }

  async editProject(editProjectDto: EditProjectDto): Promise<IProject> {
    let project: IProject = await this.projectModel.findOneAndUpdate({ _id: editProjectDto.projectId}, editProjectDto, { new: true });
    return project;
  }

}
