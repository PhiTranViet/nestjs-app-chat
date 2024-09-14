import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../database/entities';
import { Repository } from 'typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = { username: 'test', password: 'password' };
      const user = { id: 1, ...createUserDto };

      jest.spyOn(repository, 'save').mockResolvedValue(user as any);

      expect(await service.create(createUserDto)).toEqual(user);
    });
  });

  describe('getListUser', () => {
    it('should return a paginated list of users', async () => {
      const paginationOptions: IPaginationOptions = { page: 1, limit: 10 };
      const users: User[] = [
        { id: 1, username: 'test', password: 'password' } as User,
      ];
      const total = 1;

      jest.spyOn(repository, 'findAndCount').mockResolvedValue([users, total]);

      const result = await service.getListUser(paginationOptions, {});
      expect(result.results).toEqual(users);
      expect(result.pagination).toEqual({
        currentPage: paginationOptions.page,
        perPage: paginationOptions.limit,
        totalItems: total,
        totalPages: Math.ceil(total / Number(paginationOptions.limit)),
      });
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, username: 'test' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as any);

      expect(await service.getUser('1')).toEqual(user);
    });
  });
});