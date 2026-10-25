import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ToBoolean } from '../../common/transformers/to-boolean';
import { SEARCH_MAX } from '../../common/pagination.constants';

export class FilterSeoDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  @MaxLength(SEARCH_MAX, {
    message: `search must be at most ${SEARCH_MAX} characters long`,
  })
  search?: string;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  isActive?: boolean;

  // Not `page`: that name is the pagination page. Missing or empty
  // (`?pageId=`) means every page.
  @IsOptional()
  @Transform(({ obj, key }) => {
    const raw: unknown = obj[key];
    return typeof raw === 'string' && raw.trim() === '' ? undefined : Number(raw);
  })
  @IsInt()
  @Min(1)
  pageId?: number;
}
