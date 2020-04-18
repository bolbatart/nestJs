import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProject } from 'src/interfaces/projects.interface';
import { Request } from 'express'; 
import { ProjectDto } from 'src/projects/dto/create-project.dto';
import * as jwt from 'jsonwebtoken';
import { DeleteProjectDto } from './dto/delete-project.dto';
import { EditProjectDto } from './dto/edit-project.dto';
import { filterProjectDto } from './dto/filter-project.dto';



@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<IProject>,
    ) { }


  async getFilteringParameters(): 
    Promise<{
      areas: string[], 
      availablePositions: string[], 
      locations: string[]
    }>  {
    let parameters = {
      areas: [], 
      availablePositions: [], 
      locations: []
    };
    await this.projectModel.find().distinct('professionalsNeeded', (err, profs) => {
      profs.forEach(prof => parameters.availablePositions.push(prof))
    })
    await this.projectModel.find().distinct('area', (err, areas) => {
      areas.forEach(area => parameters.areas.push(area))
    })
    await this.projectModel.find().distinct('location', (err, locations) => {
      locations.forEach(location => parameters.locations.push(location))
    })
    return parameters;
  }


  async getProjects(parameters): Promise<IProject> {
    try {
      if (parameters.location === undefined || parameters.location === "any") 
        parameters.location = { $type: 2};
      
      if (parameters.area === undefined || parameters.area === "any")
        parameters.area = { $type: 2};
      
      if (parameters.availablePosition === undefined || parameters.availablePosition === "any")
        parameters.availablePosition = { $type: 2};

      if (parameters.name === undefined || parameters.name === "any")
        parameters.name = { $type: 2};
      else parameters.name = { $regex: parameters.name }

      const projects: IProject = await this.projectModel.find({ 
        location: parameters.location,
        professionalsNeeded: parameters.availablePosition,
        area: parameters.area,
        name: parameters.name
      });
      
      return projects;        
    
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async getProjectById(projectId: string): Promise<IProject> {
    try {
      const project: IProject = await this.projectModel.findOne({ _id: projectId});
      return project;
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async createProject(projectDto: ProjectDto, req: Request): Promise<IProject> {
    try {
      projectDto.userId = (jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET) as {userId: string}).userId;
      const createdProject = new this.projectModel(projectDto);
      await createdProject.save();
      const { userId, description, ...projectToReturn } = createdProject.toObject();
      return projectToReturn;
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async deleteProject(projectId: string): Promise<boolean> {
    try {
      await this.projectModel.findOneAndDelete({ _id: projectId });
      return true;
    } catch (err) {
     const message = 'Server error: ' + (err.message || err.name);
     throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
   }


  async editProject(editProjectDto: EditProjectDto, req: Request): Promise<IProject> {
    try {
      const usrId: string = (jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET) as {userId: string}).userId;
      const edited = await this.projectModel.findOneAndUpdate({ _id: editProjectDto.projectId, userId: usrId}, editProjectDto, { new: true });
      const { userId, description, ...projectToReturn } = edited.toObject();
      return projectToReturn;
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async filters(): Promise<{ locations: [string], areas: [string], professionalsNeeded: [string] }> {
    try {
      const locations = await this.projectModel.distinct('location');
      const areas = await this.projectModel.distinct('area');
      const professionalsNeeded = await this.projectModel.distinct('professionalsNeeded');
      return { locations, areas, professionalsNeeded };        
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async commentProject(projectId: string, userId: string, comment: string): Promise<IProject> {
    try {
      const project = await this.projectModel.findOne({_id: projectId});
      if(!project.comments){
        project.comments = [{userId, comment}]
      } else project.comments.push({userId, comment})
      await project.save();
      return project;
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async likeProject(projectId: string, userId: string) {
      try {
        const project = await this.projectModel.findOne({ _id: projectId });
        if (project.like.includes(userId)) 
          project.like.splice(project.like.indexOf(userId), 1)
        else {
          project.like ? project.like.push(userId) : project.like = [userId];
          if (project.dislike.includes(userId))
            project.dislike.splice(project.dislike.indexOf(userId), 1)
        }
        await project.save();
        return project;
      } catch (err) {
        const message = 'Server error: ' + (err.message || err.name);
        throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  async dislikeProject(projectId: string, userId: string) {
    try {
      const project = await this.projectModel.findOne({ _id: projectId });
      if (project.dislike.includes(userId)) 
        project.dislike.splice(project.dislike.indexOf(userId), 1)
      else {
        project.dislike ? project.dislike.push(userId) : project.dislike = [userId];
        if (project.like.includes(userId))
          project.like.splice(project.like.indexOf(userId), 1)
      }
      await project.save();
      return project;
    } catch (err) {
      const message = 'Server error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }

}
