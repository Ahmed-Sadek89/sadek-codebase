import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePageDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name_en!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name_ar!: string;
}
