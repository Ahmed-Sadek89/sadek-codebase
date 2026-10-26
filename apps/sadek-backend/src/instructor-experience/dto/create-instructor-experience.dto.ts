import { Type } from 'class-transformer';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';
import {
    INSTRUCTOR_EXPERIENCE_NAME_MAX,
    INSTRUCTOR_EXPERIENCE_PLATFORM_NAME_MAX,
    INSTRUCTOR_EXPERIENCE_RANK_MIN,
} from '@repo/constants/instructor-experience';
import { URL_MAX } from '@repo/constants/url';
import { URL_OPTIONS } from '../../common/validation/url-options';
import { ToRichText } from '../../common/transformers/to-rich-text';

export class CreateInstructorExperienceDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(INSTRUCTOR_EXPERIENCE_NAME_MAX)
    name!: string;

    @IsUrl(URL_OPTIONS)
    @MaxLength(URL_MAX)
    courseLink!: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(URL_MAX)
    coverPhotoUrl?: string;

    /** HTML from the dashboard editor, sanitized on the way in (see ToRichText). */
    @ToRichText()
    @IsString()
    @IsNotEmpty()
    descriptionAr!: string;

    @ToRichText()
    @IsString()
    @IsNotEmpty()
    descriptionEn!: string;

    @Type(() => Date)
    @IsDate()
    startAt!: Date;

    /** Must be on or after `startAt`. */
    @Type(() => Date)
    @IsDate()
    endAt!: Date;

    /** Where the course was taught, e.g. "Udemy". */
    @IsString()
    @IsNotEmpty()
    @MaxLength(INSTRUCTOR_EXPERIENCE_PLATFORM_NAME_MAX)
    coursePlatformName!: string;

    @IsUrl(URL_OPTIONS)
    @MaxLength(URL_MAX)
    coursePlatformUrl!: string;

    /** Display order on the website (lowest first); 0 when omitted. */
    @IsOptional()
    @IsInt()
    @Min(INSTRUCTOR_EXPERIENCE_RANK_MIN)
    rank?: number;

    /** Defaults to true when omitted. */
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    /** One or more of the user's skill ids taught in the course. */
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsInt({ each: true })
    skillsIds!: number[];
}
