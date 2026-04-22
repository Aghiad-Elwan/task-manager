import {
  IsString,
  IsOptional,
  IsIn,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsIn(['pending', 'in-progress', 'completed'], {
    message: 'الـ status لازم يكون pending أو in-progress أو completed',
  })
  status?: 'pending' | 'in-progress' | 'completed';
}
