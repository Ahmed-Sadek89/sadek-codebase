import { ArrayMinSize, IsArray, IsBoolean, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSkillDto {
    @IsString()
    @MaxLength(50)
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
