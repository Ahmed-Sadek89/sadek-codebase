import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';

const URL_OPTIONS = {
    protocols: ['http', 'https'],
    require_tld: true,
    require_protocol: true,
    require_valid_protocol: true,
};

export class CreateUserInfoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    headTitle!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    shortDescription!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsInt()
    @Min(0)
    yearsOfExp!: number;

    @IsInt()
    @Min(0)
    companies!: number;

    @IsInt()
    @Min(0)
    projectNumbers!: number;

    @IsInt()
    @Min(0)
    techMastering!: number;

    @IsEmail()
    @IsOptional()
    @MaxLength(255)
    gmail?: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(255)
    linkedin?: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(255)
    github?: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(255)
    cv?: string;
}
