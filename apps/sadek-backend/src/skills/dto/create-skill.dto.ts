import { ArrayMinSize, IsArray, IsBoolean, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { SKILL_NAME_MAX } from '@repo/constants/skills';

export class CreateSkillDto {
    @IsString()
    @MaxLength(SKILL_NAME_MAX)
    @IsNotEmpty()
    name!: string;

    @IsBoolean()
    @IsNotEmpty()
    isActive?: boolean;

    @IsArray()
    @ArrayMinSize(1)
    @Type(() => Number)
    @IsInt({ each: true })
    categorySkillsIds!: number[];
}
