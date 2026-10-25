import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PAGINATION, SORT_ORDERS, type SortOrder } from '../pagination.constants';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGINATION.MIN_PAGE)
  page: number = PAGINATION.DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGINATION.MIN_LIMIT)
  @Max(PAGINATION.MAX_LIMIT, {
    message: `Max limit is ${PAGINATION.MAX_LIMIT}`,
  })
  limit: number = PAGINATION.DEFAULT_LIMIT;

  @IsOptional()
  @IsString()
  @IsIn(SORT_ORDERS)
  order: SortOrder = PAGINATION.DEFAULT_ORDER;
}
