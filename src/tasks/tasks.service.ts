import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Task, TaskHistoryEntry } from './interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private idCounter = 1;

  constructor(private readonly usersService: UsersService) {}

  /**
   The status is calculated from the progress:
* 0 → Pending (Entered)
* 1-99 → In Progress (Work)
* 100 → Completed (Finished)
   */

  private deriveStatus(progress: number): Task['status'] {
    if (progress === 0) return 'pending';
    if (progress === 100) return 'completed';
    return 'in-progress';
  }

  // Creates a new history entry
  private createHistoryEntry(
    progress: number,
    status: Task['status'],
    note: string,
  ): TaskHistoryEntry {
    return {
      changedAt: new Date(),
      progress,
      status,
      note,
    };
  }

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
    this.usersService.findOne(userId);
    return this.tasks.filter((t) => t.userId === userId);
  }

  // changes date back to a specific task.
  getHistory(id: number): TaskHistoryEntry[] {
    const task = this.findOne(id); // رح يرمي 404 لو ما موجودة
    return task.history;
  }

  create(createTaskDto: CreateTaskDto): Task {
    // Ensure the user exists
    this.usersService.findOne(createTaskDto.userId);

    // Calculate the initial progress
    const initialProgress = createTaskDto.progress ?? 0;

    // Calculate the initial status
    const initialStatus = this.deriveStatus(initialProgress);

    // create the first history entry (creation log).
    const initialHistoryEntry = this.createHistoryEntry(
      initialProgress,
      initialStatus,
      'تم إنشاء المهمة',
    );

    const newTask: Task = {
      id: this.idCounter++,
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: initialStatus,
      progress: initialProgress,
      userId: createTaskDto.userId,
      createdAt: new Date(),
      history: [initialHistoryEntry], // Start with the creation entry.
    };

    this.tasks.push(newTask);
    return newTask;
  }

  /**
   * General task update (title, description)

* Note: We don't allow status or progress updates here.

* Because we have a custom method (updateProgress).
   */
  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`المهمة رقم ${id} ما موجودة`);
    }

    const currentTask = this.tasks[taskIndex];

    // Merge the updates (excluding undefined values)
    this.tasks[taskIndex] = {
      ...currentTask,
      ...Object.fromEntries(
        Object.entries(updateTaskDto).filter(([, v]) => v !== undefined),
      ),
    };

    return this.tasks[taskIndex];
  }

  updateProgress(id: number, updateProgressDto: UpdateProgressDto): Task {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`المهمة رقم ${id} ما موجودة`);
    }

    const currentTask = this.tasks[taskIndex];
    const oldProgress = currentTask.progress;
    const newProgress = updateProgressDto.progress;

    // Don't allow backtracking in progress.
    if (newProgress < oldProgress) {
      throw new BadRequestException(
        `لا يمكن تقليل نسبة الإنجاز من ${oldProgress}% إلى ${newProgress}%`,
      );
    }

    // Calculate the new status
    const newStatus = this.deriveStatus(newProgress);

    // Add the note if provided
    const note =
      updateProgressDto.note ??
      `تم تحديث التقدم من ${oldProgress}% إلى ${newProgress}%`;

    // Create a new history entry
    const historyEntry = this.createHistoryEntry(newProgress, newStatus, note);

    // Update the task by adding the history entry
    this.tasks[taskIndex] = {
      ...currentTask,
      progress: newProgress,
      status: newStatus,
      history: [...currentTask.history, historyEntry], // نضيف للسجل
    };

    return this.tasks[taskIndex];
  }

  remove(id: number): { message: string } {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`المهمة رقم ${id} ما موجودة`);
    }
    this.tasks.splice(taskIndex, 1);
    return { message: `تم حذف المهمة رقم ${id} بنجاح` };
  }
}
