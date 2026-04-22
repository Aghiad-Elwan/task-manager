import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should update a user and keep existing fields when using UpdateUserDto instance', () => {
    const user = service.create({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
    });

    const dto = new UpdateUserDto();
    dto.name = 'aghiad';
    // email and role are undefined here

    const updatedUser = service.update(user.id, dto);

    expect(updatedUser.id).toBe(user.id);
    expect(updatedUser.name).toBe('aghiad');
    expect(updatedUser.email).toBe('john@example.com');
    expect(updatedUser.role).toBe('admin');
  });
});
