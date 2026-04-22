import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { UsersService } from '../users/users.service';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [TasksService, UsersService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should update a task and keep existing fields when using UpdateTaskDto instance', () => {
    const usersService = module.get<UsersService>(UsersService);
    const user = usersService.create({
      name: 'User 1',
      email: 'user1@test.com',
    });

    const task = service.create({
      title: 'Task 1',
      description: 'Desc 1',
      userId: user.id,
    });

    const dto = new UpdateTaskDto();
    dto.title = 'Updated Task';

    const updatedTask = service.update(task.id, dto);

    expect(updatedTask.id).toBe(task.id);
    expect(updatedTask.title).toBe('Updated Task');
    expect(updatedTask.description).toBe('Desc 1');
    expect(updatedTask.status).toBe('pending');
  });
});
