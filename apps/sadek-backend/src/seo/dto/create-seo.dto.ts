import { Type } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayUnique,
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Matches,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import {
    HREFLANG_LANG_MAX,
    HREFLANG_MAX,
    HREFLANG_PATTERN,
    SEO_URL_MAX,
    type SeoHreflang,
} from '@repo/constants/hreflang';
import { SeoPageName } from '@repo/constants/seo-pages';
import { TwitterCard } from '@repo/constants/twitter-card';

const URL_OPTIONS = {
    protocols: ['http', 'https'],
    require_tld: true,
    require_protocol: true,
    require_valid_protocol: true,
};

export class SeoHreflangDto implements SeoHreflang {
    @IsString()
    @MaxLength(HREFLANG_LANG_MAX)
    @Matches(HREFLANG_PATTERN, { message: 'lang must be a language code such as en, en-GB or x-default' })
    lang!: string;

    @IsUrl(URL_OPTIONS)
    @MaxLength(SEO_URL_MAX)
    url!: string;
}

// isActive is not writable here: PATCH /seo/:id/toggle-active switches it.
export class CreateSeoDto {
    @IsEnum(SeoPageName)
    pageName!: SeoPageName;

    @IsString()
    @IsNotEmpty()
    @MaxLength(70)
    metaTitle_en!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(70)
    metaTitle_ar!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(170)
    metaDescription_en!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(170)
    metaDescription_ar!: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(SEO_URL_MAX)
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
    @MaxLength(100)
    ogTitle_en?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    ogTitle_ar?: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    ogDescription_en?: string;

    @IsString()
    @IsOptional()
    @MaxLength(200)
    ogDescription_ar?: string;

    @IsUrl(URL_OPTIONS)
    @IsOptional()
    @MaxLength(255)
    ogImage?: string;

    @IsString()
    @IsOptional()
    @MaxLength(150)
    ogImageAlt_en?: string;

    @IsString()
    @IsOptional()
    @MaxLength(150)
    ogImageAlt_ar?: string;

    @IsEnum(TwitterCard)
    @IsOptional()
    twitterCard?: TwitterCard;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    @Matches(/^@?\w{1,15}$/, { message: 'twitterHandle must be a valid X/Twitter handle' })
    twitterHandle?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    jobTitle_en?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    jobTitle_ar?: string;

    @IsBoolean()
    @IsOptional()
    robotsIndex?: boolean;

    @IsBoolean()
    @IsOptional()
    robotsFollow?: boolean;
}
