import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

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

  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;
 
}
