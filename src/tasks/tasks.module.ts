import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { UsersModule } from '../users/users.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [UsersModule, CommonModule],
  exports: [TasksService],
})
export class TasksModule {}
