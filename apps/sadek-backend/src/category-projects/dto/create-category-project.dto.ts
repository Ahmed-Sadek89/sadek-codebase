import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt, MaxLength, Min } from 'class-validator';
import { CATEGORY_PROJECT_NAME_MAX, CATEGORY_PROJECT_RANK_MIN } from '@repo/constants/category-projects';

export class CreateCategoryProjectDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(CATEGORY_PROJECT_NAME_MAX)
    nameAr!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(CATEGORY_PROJECT_NAME_MAX)
    nameEn!: string;

    /** Display order (lowest first); 0 when omitted. */
    @IsOptional()
    @IsInt()
    @Min(CATEGORY_PROJECT_RANK_MIN)
    rank?: number;

    @IsBoolean()
    @IsNotEmpty()
    isActive!: boolean;

}
