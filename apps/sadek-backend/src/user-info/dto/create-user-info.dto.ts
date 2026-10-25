import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, Min } from 'class-validator';
import {
    PHONE_MAX,
    PHONE_PATTERN,
    USER_INFO_COUNT_MIN,
    USER_INFO_HEAD_TITLE_MAX,
    USER_INFO_SHORT_DESCRIPTION_MAX,
} from '@repo/constants/user-info';
import { URL_MAX } from '@repo/constants/url';
import { URL_OPTIONS } from '../../common/validation/url-options';

const PHONE_MESSAGE = `$property must be a phone number with 7–15 digits, e.g. +20 100 123 4567`;

export class CreateUserInfoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(USER_INFO_HEAD_TITLE_MAX)
    headTitle_en!: string;

    @IsString()
    @IsOptional()
    @MaxLength(USER_INFO_HEAD_TITLE_MAX)
    headTitle_ar?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(USER_INFO_SHORT_DESCRIPTION_MAX)
    shortDescription_en!: string;

    @IsString()
    @IsOptional()
    @MaxLength(USER_INFO_SHORT_DESCRIPTION_MAX)
    shortDescription_ar?: string;

    @IsString()
    @IsNotEmpty()
    description_en!: string;

    @IsString()
    @IsOptional()
    description_ar?: string;

    @IsInt()
    @Min(USER_INFO_COUNT_MIN)
    yearsOfExp!: number;

    @IsInt()
    @Min(USER_INFO_COUNT_MIN)
    companies!: number;

    @IsInt()
    @Min(USER_INFO_COUNT_MIN)
    projectNumbers!: number;

    @IsInt()
    @Min(USER_INFO_COUNT_MIN)
    techMastering!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(PHONE_MAX)
    @Matches(PHONE_PATTERN, { message: PHONE_MESSAGE })
    phoneNumber!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(PHONE_MAX)
    @Matches(PHONE_PATTERN, { message: PHONE_MESSAGE })
    whatsappNumber!: string;
    

    @IsEmail()
    @IsOptional()
    @MaxLength(URL_MAX)
    gmail?: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(URL_MAX)
    linkedin?: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(URL_MAX)
    github?: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(URL_MAX)
    cv?: string;
}
