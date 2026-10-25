import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import {
    EmploymentType,
    LocationType,
    USER_COMPANY_JOB_TITLE_MAX,
    USER_COMPANY_LOCATION_MAX,
    USER_COMPANY_NAME_MAX,
} from '@repo/constants/user-company';
import { URL_MAX } from '@repo/constants/url';
import { URL_OPTIONS } from '../../common/validation/url-options';

export class CreateUserCompanyDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(USER_COMPANY_NAME_MAX)
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
    @MaxLength(URL_MAX)
    logo?: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(URL_MAX)
    company_site?: string;

    /** The role held there, e.g. "Senior Front-end Developer". */
    @IsString()
    @IsNotEmpty()
    @MaxLength(USER_COMPANY_JOB_TITLE_MAX)
    job_title!: string;

    /** City and/or country, e.g. "Cairo, Egypt". */
    @IsString()
    @IsNotEmpty()
    @MaxLength(USER_COMPANY_LOCATION_MAX)
    location!: string;

    @IsEnum(LocationType)
    location_type!: LocationType;

    @IsEnum(EmploymentType)
    employment_type!: EmploymentType;

    /** Defaults to true when omitted. */
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
