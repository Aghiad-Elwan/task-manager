import {
  IsString,
  IsInt,
  IsPositive,
  MinLength,
  IsNotEmpty,
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
}
