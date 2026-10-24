import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ToBoolean } from '../../common/transformers/to-boolean';

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
