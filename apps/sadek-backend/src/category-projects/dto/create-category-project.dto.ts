import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { CATEGORY_PROJECT_DESCRIPTION_MAX, CATEGORY_PROJECT_NAME_MAX } from '@repo/constants/category-projects';

export class CreateCategoryProjectDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(CATEGORY_PROJECT_NAME_MAX)
    nameAr!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(CATEGORY_PROJECT_NAME_MAX)
    nameEn!: string;

    @IsString()
    @IsOptional()
    @MaxLength(CATEGORY_PROJECT_DESCRIPTION_MAX)
    descriptionAr?: string;

    @IsString()
    @IsOptional()
    @MaxLength(CATEGORY_PROJECT_DESCRIPTION_MAX)
    descriptionEn?: string;

    @IsBoolean()
    @IsNotEmpty()
    isActive!: boolean;

}
