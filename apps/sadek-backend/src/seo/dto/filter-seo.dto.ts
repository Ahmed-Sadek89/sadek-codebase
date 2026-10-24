import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ToBoolean } from '../../common/transformers/to-boolean';
import { SeoPageName } from '@repo/constants/seo-pages';

export class FilterSeoDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  @MaxLength(20, {
    message: 'search be at most 20 characters long',
  })
  search?: string;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  isActive?: boolean;

  // Not `page`: that name is the pagination page. Missing or empty
  // (`?pageName=`) means every page.
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value.trim() === '' ? undefined : value))
  @IsEnum(SeoPageName)
  pageName?: SeoPageName;
}
