import {
  IsEmail,
  IsString,
  IsOptional,
  IsIn,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional() // Optional field in update
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @IsOptional() // Optional field in update
  @IsEmail()
  email?: string;

  @IsOptional() // Optional field in update
  @IsIn(['admin', 'user'])
  role?: 'admin' | 'user';
}
