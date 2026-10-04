import { ArrayMinSize, IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSkillDto {
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    nameAr!: string;

    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    nameEn!: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    avatar_url?: string;

    @IsBoolean()
    @IsNotEmpty()
    isActive?: boolean;

    @IsArray()
    @ArrayMinSize(1)
    @Type(() => Number)
    @IsInt({ each: true })
    categorySkillsIds!: number[];
}
