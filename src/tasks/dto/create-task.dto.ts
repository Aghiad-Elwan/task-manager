import {
  IsString,
  IsInt,
  IsPositive,
  IsNotEmpty,
  IsOptional,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'العنوان مطلوب' })
  @IsString()
  @MinLength(3, { message: 'العنوان لازم يكون على الأقل 3 حروف' })
  @MaxLength(100)
  title: string;

  @IsNotEmpty({ message: 'الوصف مطلوب' })
  @IsString()
  @MaxLength(500)
  description: string;

  @IsNotEmpty({ message: 'الـ userId مطلوب' })
  @IsInt({ message: 'الـ userId لازم يكون رقم صحيح' })
  @IsPositive({ message: 'الـ userId لازم يكون أكبر من صفر' })
  userId: number;

  @IsOptional()
  @IsInt({ message: 'الـ progress لازم يكون رقم صحيح' })
  @Min(0, { message: 'الـ progress ما يقدر يكون أقل من 0' })
  @Max(100, { message: 'الـ progress ما يقدر يكون أكبر من 100' })
  progress?: number;
}
