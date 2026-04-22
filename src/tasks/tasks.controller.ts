import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { CurrentUser } from '../common/decorators/current-user/current-user.decorator';
import type { User } from '../users/interfaces/user.interface';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('my-tasks')
  findMyTasks(@CurrentUser() user: User) {
    return this.tasksService.findByUserId(user.id);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.tasksService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
