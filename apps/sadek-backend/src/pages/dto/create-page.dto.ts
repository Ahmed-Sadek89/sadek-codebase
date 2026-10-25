import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PAGE_NAME_MAX } from '@repo/constants/pages';

export class CreatePageDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(PAGE_NAME_MAX)
    name_en!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(PAGE_NAME_MAX)
    name_ar!: string;
}
