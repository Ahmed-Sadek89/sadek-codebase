import { OmitType } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { type SortOrder } from '../../common/pagination.constants';

/**
 * Query for both GET /user-company and GET /user-company/me.
 * `order` has no default, so each route keeps its own direction when it is omitted:
 * `findAll` sorts by `createdAt` (default DESC); `findMine` by `startWorkFrom` (default DESC).
 */
export class FilterUserCompanyDto extends OmitType(PaginationQueryDto, ['order'] as const) {
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order?: SortOrder;

  /** Case-insensitive match on the company name or the English or Arabic description. */
  @IsString()
  @IsOptional()
  @MaxLength(20, {
    message: 'search be at most 20 characters long',
  })
  search?: string;
}
