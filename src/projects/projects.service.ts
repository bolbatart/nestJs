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
    try {
      // Object.keys(parameters).forEach( key => {
      //   if (parameters[key] === 'any') {
      //     parameters[key] = { $type: 2 };
      //   } else if (key != 'location') {
      //     parameters[key] = { $in: parameters[key] };
      //   }
      // });
      if (parameters.location === undefined || parameters.location === "any")
        parameters.location = { $type: 2};
      if (parameters.area === undefined || parameters.area[0] === "any")
        parameters.area = { $type: 2};
      if (parameters.availablePositions === undefined || parameters.availablePositions[0] === "any")
        parameters.availablePositions = { $type: 2};
      const projects = await this.projectModel.find({ 
        location: parameters.location,
        professionalsNeeded: parameters.availablePositions,
        area: parameters.area
      });
      return projects;        
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProjectById(projectId: string): Promise<IProject> {
    try {
      let project: IProject = await this.projectModel.findOne({ _id: projectId});
      return project;
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createProject(projectDto: ProjectDto, req: Request): Promise<IProject> {
    try {
      projectDto.userId = await (<any>jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET)).userId;
      const createdProject = new this.projectModel(projectDto);
      await createdProject.save();
      return createdProject;
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteProject(deleteProjectDto: DeleteProjectDto): Promise<boolean> {
   try {
     await this.projectModel.findOneAndRemove({ _id: deleteProjectDto.projectId });
     return true;
   } catch (err) {
    const message = 'Server error: ' + (err.message || err.name);
    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
   }
  }

  async editProject(editProjectDto: EditProjectDto): Promise<IProject> {
    try {
      const project: IProject = await this.projectModel.findOneAndUpdate({ _id: editProjectDto.projectId}, editProjectDto, { new: true });
      return project;
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
