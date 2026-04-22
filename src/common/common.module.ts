import { Module, forwardRef } from '@nestjs/common';
import { AuthGuard } from './guards/auth/auth.guard';
import { RolesGuard } from './guards/roles/roles.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [AuthGuard, RolesGuard],
  exports: [AuthGuard, RolesGuard],
})
export class CommonModule {}
