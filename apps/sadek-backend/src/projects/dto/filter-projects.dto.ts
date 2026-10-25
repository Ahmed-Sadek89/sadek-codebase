import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ToBoolean } from '../../common/transformers/to-boolean';
import { SEARCH_MAX } from '../../common/pagination.constants';

export class FilterProjectDto extends PaginationQueryDto {
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

  /** Only projects linked to this project category. */
  @IsOptional()
  @IsInt()
  @Min(1)
  categoryId?: number;
}
