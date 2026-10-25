import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCategorySkillDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nameAr!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nameEn!: string;

  @IsString()
  @IsOptional()
  descriptionAr?: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;

  /** Display order (lowest first); 0 when omitted. */
  @IsOptional()
  @IsInt()
  @Min(0)
  rank?: number;

  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;
 
}
