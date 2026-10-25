import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import {
    WHAT_CAN_DO_RANK_MIN,
    WHAT_CAN_DO_SHORT_DESCRIPTION_MAX,
    WHAT_CAN_DO_TITLE_MAX,
} from '@repo/constants/what-can-do';

export class CreateWhatCanDoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(WHAT_CAN_DO_TITLE_MAX)
    title_en!: string;

    @IsString()
    @IsOptional()
    @MaxLength(WHAT_CAN_DO_TITLE_MAX)
    title_ar?: string;

    @IsString()
    @IsOptional()
    @MaxLength(WHAT_CAN_DO_SHORT_DESCRIPTION_MAX)
    shortDescription_en?: string;

    @IsString()
    @IsOptional()
    @MaxLength(WHAT_CAN_DO_SHORT_DESCRIPTION_MAX)
    shortDescription_ar?: string;

    @IsString()
    @IsOptional()
    description_en?: string;

    @IsString()
    @IsOptional()
    description_ar?: string;

    /** Display order. */
    @IsInt()
    @Min(WHAT_CAN_DO_RANK_MIN)
    rank!: number;

    /** Defaults to true when omitted. */
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
