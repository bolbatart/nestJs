import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';

describe('Some tests', () => {
	let module: TestingModule;
	let service: ProjectsService;

  beforeAll(async () => {
		module = await Test.createTestingModule({
      providers: [ ProjectsService ]
    }).compile();
	});
	
	beforeEach(() => {
		service = module.get(ProjectsService);
	});
	
	afterEach(() => {
		jest.resetAllMocks();
	});
	
	it('should be defined', () => {
		expect(service).toBeDefined();
	});

});
