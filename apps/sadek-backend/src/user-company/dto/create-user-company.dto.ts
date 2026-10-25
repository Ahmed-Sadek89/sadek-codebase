import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

const URL_OPTIONS = {
    protocols: ['http', 'https'],
    require_tld: true,
    require_protocol: true,
    require_valid_protocol: true,
};

export class CreateUserCompanyDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    company_name!: string;

    @IsString()
    @IsOptional()
    description_en?: string;

    @IsString()
    @IsOptional()
    description_ar?: string;

    @Type(() => Date)
    @IsDate()
    startWorkFrom!: Date;

    /** Leave empty while still working there. */
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    startWorkTo?: Date;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(255)
    logo?: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(255)
    company_site?: string;
}
