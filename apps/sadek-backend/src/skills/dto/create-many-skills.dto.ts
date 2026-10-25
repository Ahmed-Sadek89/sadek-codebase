import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SKILL_NAME_MAX, SKILLS_BULK_MAX } from '@repo/constants/skills';

/** Many skills at once; every one gets the same `isActive` and categories. */
export class CreateManySkillsDto {
    // Trimmed first, so a blank name fails IsNotEmpty.
    @Transform(({ value }) =>
        Array.isArray(value) ? value.map((name) => (typeof name === 'string' ? name.trim() : name)) : value,
    )
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(SKILLS_BULK_MAX)
    @ArrayUnique((name: string) => String(name).toLowerCase(), {
        message: 'names must not contain duplicates',
    })
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @MaxLength(SKILL_NAME_MAX, { each: true })
    names!: string[];

    @IsBoolean()
    @IsNotEmpty()
    isActive!: boolean;

    @IsArray()
    @ArrayMinSize(1)
    @Type(() => Number)
    @IsInt({ each: true })
    categorySkillsIds!: number[];
}
