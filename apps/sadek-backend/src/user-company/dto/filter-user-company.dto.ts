import { OmitType } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { SORT_ORDERS, type SortOrder } from '../../common/pagination.constants';
import { ToBoolean } from '../../common/transformers/to-boolean';
import { SEARCH_MAX } from '../../common/pagination.constants';

/**
 * Query for both GET /user-company and GET /user-company/me.
 * `order` has no default, so each route keeps its own direction when it is omitted:
 * `findAll` sorts by `createdAt` (default DESC); `findMine` by `startWorkFrom` (default DESC).
 */
export class FilterUserCompanyDto extends OmitType(PaginationQueryDto, ['order'] as const) {
  @IsOptional()
  @IsString()
  @IsIn(SORT_ORDERS)
  order?: SortOrder;

  /** Case-insensitive match on the company name or the English or Arabic description. */
  @IsString()
  @IsOptional()
  @MaxLength(SEARCH_MAX, {
    message: `search must be at most ${SEARCH_MAX} characters long`,
  })
  search?: string;

  /** Ignored by GET /user-company/public, which only returns active rows. */
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  isActive?: boolean;
}
