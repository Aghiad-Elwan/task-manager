import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private idCounter = 1;

  constructor(private readonly usersService: UsersService) {}

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find((t) => t.id === id);

    if (!task) {
      throw new NotFoundException(`المهمة رقم ${id} ما موجودة`);
    }

    return task;
  }

  findByUserId(userId: number): Task[] {
    // أ نتأكد إنه المستخدم موجود
    // لو مش موجود، findOne رح يرمي NotFoundException تلقائياً
    this.usersService.findOne(userId);

    //  نفلتر المهام
    return this.tasks.filter((t) => t.userId === userId);
  }

  /**
   * إنشاء مهمة جديدة
   */
  create(createTaskDto: CreateTaskDto): Task {
    this.usersService.findOne(createTaskDto.userId);

    const newTask: Task = {
      id: this.idCounter++,
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: 'pending',
      userId: createTaskDto.userId,
      createdAt: new Date(),
    };

    this.tasks.push(newTask);
    return newTask;
  }

  /**
   * تحديث مهمة
   */
  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      throw new NotFoundException(`المهمة رقم ${id} ما موجودة`);
    }

    const currentTask = this.tasks[taskIndex];

    // ندمج البيانات الجديدة مع القديمة ونشيل القيم اللي undefined
    this.tasks[taskIndex] = {
      ...currentTask,
      ...Object.fromEntries(
        Object.entries(updateTaskDto).filter(([, v]) => v !== undefined),
      ),
    };

    return this.tasks[taskIndex];
  }

  remove(id: number): { message: string } {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);

    if (taskIndex === -1) {
      throw new NotFoundException(`المهمة رقم ${id} مش موجودة`);
    }

    this.tasks.splice(taskIndex, 1);
    return { message: `تم حذف المهمة رقم ${id} بنجاح` };
  }
}
