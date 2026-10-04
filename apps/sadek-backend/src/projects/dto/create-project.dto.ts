import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsUrl, MaxLength, IsArray, ArrayNotEmpty, ArrayUnique, IsInt } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nameAr!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nameEn!: string;

    @IsString()
    @IsNotEmpty()
    descriptionAr!: string;

    @IsString()
    @IsNotEmpty()
    descriptionEn!: string;

    @IsBoolean()
    @IsNotEmpty()
    isActive!: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    mainImageUrl?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    liveUrl?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    repoUrl?: string;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsInt({ each: true })
    categoryProjectsIds!: number[];
}
