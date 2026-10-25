import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsUrl, MaxLength, IsArray, ArrayNotEmpty, ArrayUnique, IsInt } from 'class-validator';
import { PROJECT_NAME_MAX } from '@repo/constants/projects';
import { URL_MAX } from '@repo/constants/url';
import { URL_OPTIONS } from '../../common/validation/url-options';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(PROJECT_NAME_MAX)
    nameAr!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(PROJECT_NAME_MAX)
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

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(URL_MAX)
    mainImageUrl?: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(URL_MAX)
    liveUrl?: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(URL_MAX)
    repoUrl?: string;


    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsInt({ each: true })
    categoryProjectsIds!: number[];
}
