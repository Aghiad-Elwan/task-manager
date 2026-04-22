import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class UpdateProgressDto {
  @IsNotEmpty({ message: 'الـ progress مطلوب' })
  @IsInt({ message: 'الـ progress لازم يكون رقم صحيح' })
  @Min(0, { message: 'الـ progress ما يقدر يكون أقل من 0' })
  @Max(100, { message: 'الـ progress ما يقدر يكون أكبر من 100' })
  progress: number;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'الملاحظة لا يمكن أن تتجاوز 200 حرف' })
  note?: string;
}
