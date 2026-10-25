import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsBoolean, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

/** Max skills one POST /skills/bulk can insert. */
export const SKILLS_BULK_MAX = 50;

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
    @MaxLength(50, { each: true })
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
