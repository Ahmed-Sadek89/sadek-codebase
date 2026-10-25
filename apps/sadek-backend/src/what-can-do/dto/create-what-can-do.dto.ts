import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateWhatCanDoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    title_en!: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    title_ar?: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    shortDescription_en?: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    shortDescription_ar?: string;

    @IsString()
    @IsOptional()
    description_en?: string;

    @IsString()
    @IsOptional()
    description_ar?: string;

    /** Display order. */
    @IsInt()
    @Min(0)
    rank!: number;

    /** Defaults to true when omitted. */
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
