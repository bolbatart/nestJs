import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ProjectSchema } from '../schemas/project.schema';
import { ConfigModule } from '@nestjs/config';
import { ProjectDto } from './dto/create-project.dto';


describe('projects.service.ts test: ', () => {
  let module: TestingModule;
  let service: ProjectsService;

  const mockProjectModel = {
    find: jest.fn(x => Promise.resolve(x)),
    findOne: jest.fn(x => Promise.resolve(x)),
    save: jest.fn(x => Promise.resolve(x)),
    findOneAndRemove: jest.fn(x => Promise.resolve(x)),
    findOneAndUpdate: jest.fn(x => Promise.resolve(x)),
    distinct: jest.fn(x => Promise.resolve(x))
  }
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [
        ProjectsService,
        { provide: getModelToken('Project'), useValue: mockProjectModel }
      ]
    }).compile();
  });

  beforeEach(() => {
    service = module.get(ProjectsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('To be defined', () => {
    expect(service).toBeDefined();
  });

  it('find all', async () => {
    const projects = await service.test();
    expect(projects).toHaveLength(3);
  });



  // it('Get project by id', async () => {
	// const id = '5e53ac3a7b69a82dc0cb2921';
	// const obj = await service.getProjectById(id);
  //   expect(obj).toEqual(expect.objectContaining({ id }));
  // });

  // it('Delete project', async () => {
  //   const id = '5e53ac3a7b69a82dc0cb2921';
  //   expect(service.deleteProject({ projectId: id })).toEqual(true);
  // });
  
  // it('Create project', async () => {
  //   const mockProjectCreate = {
  //       name: 'name',
  //       location: 'location',
  //       professionalsNeeded: [
  //         'pn1',
  //         'pn2',
  //         'pn3'
  //       ],
  //       area: [
  //         'ar1',
  //         'ar2'
  //       ],
  //       shortDescription: 'sdecr',
  //       description: 'descr'
	// }
	// let resMock: any;
  //   expect(await service.createProject(mockProjectCreate, resMock)).toEqual(expect.objectContaining(mockProjectCreate));
  // });

});