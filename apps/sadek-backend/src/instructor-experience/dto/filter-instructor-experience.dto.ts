import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { SORT_ORDERS, SEARCH_MAX, type SortOrder } from '../../common/pagination.constants';
import { ToBoolean } from '../../common/transformers/to-boolean';

/**
 * Query for GET /instructor-experience and GET /instructor-experience/public.
 * `order` has no default, so each route keeps its own direction when it is omitted:
 * `findAll` sorts by `createdAt` (default DESC); `findAllPublic` by `rank` (default ASC).
 */
export class FilterInstructorExperienceDto extends OmitType(PaginationQueryDto, ['order'] as const) {
  @IsOptional()
  @IsString()
  @IsIn(SORT_ORDERS)
  order?: SortOrder;

  /** Case-insensitive match on the course name or platform name. */
  @IsString()
  @IsOptional()
  @MaxLength(SEARCH_MAX, {
    message: `search must be at most ${SEARCH_MAX} characters long`,
  })
  search?: string;

  /** Ignored by GET /instructor-experience/public, which only returns active rows. */
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  isActive?: boolean;

  /** Only rows linked to this skill. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  skillId?: number;
}
