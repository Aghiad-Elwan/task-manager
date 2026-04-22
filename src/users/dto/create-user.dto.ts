import {
  IsEmail,
  IsString,
  IsOptional,
  IsIn,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  @IsString({ message: 'الاسم لازم يكون نص' })
  @MinLength(2, { message: 'الاسم لازم يكون على الأقل حرفين' })
  @MaxLength(50, { message: 'الاسم لازم ما يتجاوز 50 حرف' })
  name: string;

  @IsNotEmpty({ message: 'الإيميل مطلوب' })
  @IsString({ message: 'الإيميل لازم يكون نص' })
  @IsEmail({}, { message: 'الإيميل ليس صحيح' })
  email: string;

  @IsNotEmpty({ message: 'الrole مطلوب' })
  @IsOptional()
  @IsIn(['admin', 'user'], {
    message: 'الـ role لازم يكون admin أو user',
  })
  role?: 'admin' | 'user';
}
