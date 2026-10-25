import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import {
  CATEGORY_SKILL_DESCRIPTION_MAX,
  CATEGORY_SKILL_NAME_MAX,
  CATEGORY_SKILL_RANK_MIN,
} from '@repo/constants/category-skills';

export class CreateCategorySkillDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(CATEGORY_SKILL_NAME_MAX)
  nameAr!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(CATEGORY_SKILL_NAME_MAX)
  nameEn!: string;

  @IsString()
  @IsOptional()
  @MaxLength(CATEGORY_SKILL_DESCRIPTION_MAX)
  descriptionAr?: string;

  @IsString()
  @IsOptional()
  @MaxLength(CATEGORY_SKILL_DESCRIPTION_MAX)
  descriptionEn?: string;

  /** Display order (lowest first); 0 when omitted. */
  @IsOptional()
  @IsInt()
  @Min(CATEGORY_SKILL_RANK_MIN)
  rank?: number;

  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;
 
}
