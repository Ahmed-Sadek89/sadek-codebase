import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateCategoryProjectDto {
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
