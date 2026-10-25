import { Type } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayUnique,
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Matches,
    MaxLength,
    Min,
    ValidateNested,
} from 'class-validator';
import {
    HREFLANG_LANG_MAX,
    HREFLANG_MAX,
    HREFLANG_PATTERN,
    type SeoHreflang,
} from '@repo/constants/hreflang';
import { TwitterCard } from '@repo/constants/twitter-card';
import {
    SEO_JOB_TITLE_MAX,
    SEO_META_DESCRIPTION_MAX,
    SEO_META_TITLE_MAX,
    SEO_OG_DESCRIPTION_MAX,
    SEO_OG_IMAGE_ALT_MAX,
    SEO_OG_TITLE_MAX,
    TWITTER_HANDLE_MAX,
    TWITTER_HANDLE_PATTERN,
} from '@repo/constants/seo';
import { URL_MAX } from '@repo/constants/url';
import { URL_OPTIONS } from '../../common/validation/url-options';

export class SeoHreflangDto implements SeoHreflang {
    @IsString()
    @MaxLength(HREFLANG_LANG_MAX)
    @Matches(HREFLANG_PATTERN, { message: 'lang must be a language code such as en, en-GB or x-default' })
    lang!: string;

    @IsUrl(URL_OPTIONS)
    @MaxLength(URL_MAX)
    url!: string;
}

// isActive is not writable here: PATCH /seo/:id/toggle-active switches it.
export class CreateSeoDto {
    // One of the signed-in user's pages; each page has at most one SEO row.
    @IsInt()
    @Min(1)
    pageId!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(SEO_META_TITLE_MAX)
    metaTitle_en!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(SEO_META_TITLE_MAX)
    metaTitle_ar!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(SEO_META_DESCRIPTION_MAX)
    metaDescription_en!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(SEO_META_DESCRIPTION_MAX)
    metaDescription_ar!: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(URL_MAX)
    canonicalUrl?: string;

    @IsArray()
    @IsOptional()
    @ArrayMaxSize(HREFLANG_MAX)
    @ArrayUnique((alternate: SeoHreflangDto) => alternate.lang, { message: 'hreflang languages must be unique' })
    @ValidateNested({ each: true })
    @Type(() => SeoHreflangDto)
    hreflang?: SeoHreflangDto[];

    @IsString()
    @IsOptional()
    keywords_en?: string;

    @IsString()
    @IsOptional()
    keywords_ar?: string;

    @IsString()
    @IsOptional()
    @MaxLength(SEO_OG_TITLE_MAX)
    ogTitle_en?: string;

    @IsString()
    @IsOptional()
    @MaxLength(SEO_OG_TITLE_MAX)
    ogTitle_ar?: string;

    @IsString()
    @IsOptional()
    @MaxLength(SEO_OG_DESCRIPTION_MAX)
    ogDescription_en?: string;

    @IsString()
    @IsOptional()
    @MaxLength(SEO_OG_DESCRIPTION_MAX)
    ogDescription_ar?: string;

    /** Browser tab icon (favicon) URL; omitted uses the website's default icon. */
    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(URL_MAX)
    favicon?: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(URL_MAX)
    ogImage?: string;

    @IsString()
    @IsOptional()
    @MaxLength(SEO_OG_IMAGE_ALT_MAX)
    ogImageAlt_en?: string;

    @IsString()
    @IsOptional()
    @MaxLength(SEO_OG_IMAGE_ALT_MAX)
    ogImageAlt_ar?: string;

    @IsEnum(TwitterCard)
    @IsOptional()
    twitterCard?: TwitterCard;

    @IsString()
    @IsOptional()
    @MaxLength(TWITTER_HANDLE_MAX)
    @Matches(TWITTER_HANDLE_PATTERN, { message: 'twitterHandle must be a valid X/Twitter handle' })
    twitterHandle?: string;

    @IsString()
    @IsOptional()
    @MaxLength(SEO_JOB_TITLE_MAX)
    jobTitle_en?: string;

    @IsString()
    @IsOptional()
    @MaxLength(SEO_JOB_TITLE_MAX)
    jobTitle_ar?: string;

    @IsBoolean()
    @IsOptional()
    robotsIndex?: boolean;

    @IsBoolean()
    @IsOptional()
    robotsFollow?: boolean;
}
