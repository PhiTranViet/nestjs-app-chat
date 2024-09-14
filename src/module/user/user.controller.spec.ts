import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './request/create-user.dto';
import { User } from '../../database/entities';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            getListUser: jest.fn(),
            getUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = { username: 'test', password: 'password' };
      const user = { id: 1, ...createUserDto };

      jest.spyOn(service, 'create').mockResolvedValue(user as any);

      expect(await controller.register(createUserDto)).toEqual(user);
    });
  });

  describe('getListUser', () => {
    it('should return a paginated list of users', async () => {
      const query = { page: '1', limit: '10' };
      const users: User[] = [
        { id: 1, username: 'test', password: 'password' } as User,
      ];      const paginationResponse = {
        results: users,
        pagination: {
          currentPage: query.page,
          perPage: query.limit,
          totalItems: 1,
          totalPages: 1,
        },
      };

      // jest.spyOn(service, 'getListUser').mockResolvedValue(paginationResponse);

      expect(await controller.getListUser(query)).toEqual(paginationResponse);
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, username: 'test' };
      jest.spyOn(service, 'getUser').mockResolvedValue(user as any);

      expect(await controller.getUser('1')).toEqual(user);
    });
  });
});