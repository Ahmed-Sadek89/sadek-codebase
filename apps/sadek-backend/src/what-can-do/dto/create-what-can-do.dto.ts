import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateWhatCanDoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    title!: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    shortDescription?: string;

    @IsString()
    @IsOptional()
    description?: string;

    /** Display order. */
    @IsInt()
    @Min(0)
    rank!: number;
}
